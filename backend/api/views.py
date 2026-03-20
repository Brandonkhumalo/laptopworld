import os
import uuid
import json
import re
import logging

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.utils.decorators import method_decorator
from django.db.models import Q
from django_ratelimit.decorators import ratelimit

from .models import Category, Product, ProductImage, Deal, TopPick, Cart, CartItem, Order, OrderItem, DeliverySettings
from .serializers import (
    CategorySerializer, ProductSerializer, DealSerializer,
    TopPickSerializer, CartItemSerializer, CartSerializer,
    OrderSerializer, ProductImageSerializer, DeliverySettingsSerializer
)

logger = logging.getLogger(__name__)


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        auth = request.headers.get('Authorization', '')
        if auth.startswith('Bearer '):
            token_key = auth[7:]
            try:
                token = Token.objects.get(key=token_key)
                return token.user.is_staff
            except Token.DoesNotExist:
                return False
        return request.user and request.user.is_staff


@ratelimit(key='ip', rate='3/m', method='POST', block=True)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def admin_register(request):
    from django.contrib.auth.models import User

    username = request.data.get('username', '').strip()
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '')
    confirm_password = request.data.get('confirm_password', '')

    if not all([username, email, password, confirm_password]):
        return Response({'error': 'All fields are required'}, status=400)

    if len(username) < 3 or len(username) > 30:
        return Response({'error': 'Username must be between 3 and 30 characters'}, status=400)

    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return Response({'error': 'Username can only contain letters, numbers, and underscores'}, status=400)

    if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
        return Response({'error': 'Invalid email address'}, status=400)

    if len(password) < 8:
        return Response({'error': 'Password must be at least 8 characters'}, status=400)

    if password != confirm_password:
        return Response({'error': 'Passwords do not match'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered'}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.is_staff = True
    user.save()

    token, _ = Token.objects.get_or_create(user=user)
    logger.info(f"Admin registered: {username} from {request.META.get('REMOTE_ADDR')}")

    return Response({
        'message': 'Admin account created successfully',
        'username': user.username,
        'token': token.key,
    }, status=201)


@ratelimit(key='ip', rate='5/m', method='POST', block=True)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None and user.is_staff:
        token, _ = Token.objects.get_or_create(user=user)
        logger.info(f"Admin login successful: {user.username} from {request.META.get('REMOTE_ADDR')}")
        return Response({'message': 'Login successful', 'username': user.username, 'token': token.key})
    logger.warning(f"Admin login failed for username '{username}' from {request.META.get('REMOTE_ADDR')}")
    return Response({'error': 'Invalid credentials or not an admin'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def admin_logout(request):
    auth = request.headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        try:
            token = Token.objects.get(key=auth[7:])
            logger.info(f"Admin logout: {token.user.username} from {request.META.get('REMOTE_ADDR')}")
            token.delete()
        except Token.DoesNotExist:
            pass
    return Response({'message': 'Logged out successfully'})


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def admin_check(request):
    auth = request.headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        try:
            token = Token.objects.get(key=auth[7:])
            if token.user.is_staff:
                return Response({'authenticated': True, 'username': token.user.username})
        except Token.DoesNotExist:
            pass
    return Response({'authenticated': False})


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminUser()]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        qs = Product.objects.all()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        if category:
            qs = qs.filter(category_id=category)
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(category__name__icontains=search) |
                Q(description__icontains=search)
            )
        return qs

    def perform_create(self, serializer):
        specs = self.request.data.get('specifications', '{}')
        if isinstance(specs, str):
            try:
                specs = json.loads(specs)
            except (json.JSONDecodeError, TypeError):
                specs = {}

        key_features = self.request.data.get('key_features', '[]')
        if isinstance(key_features, str):
            try:
                key_features = json.loads(key_features)
            except (json.JSONDecodeError, TypeError):
                key_features = []

        product = serializer.save(specifications=specs, key_features=key_features)

        images = self.request.FILES.getlist('additional_images')
        for i, img in enumerate(images[:8]):
            ProductImage.objects.create(product=product, image=img, order=i)

    def perform_update(self, serializer):
        specs = self.request.data.get('specifications')
        key_features = self.request.data.get('key_features')

        kwargs = {}
        if specs is not None:
            if isinstance(specs, str):
                try:
                    kwargs['specifications'] = json.loads(specs)
                except (json.JSONDecodeError, TypeError):
                    kwargs['specifications'] = {}
            else:
                kwargs['specifications'] = specs

        if key_features is not None:
            if isinstance(key_features, str):
                try:
                    kwargs['key_features'] = json.loads(key_features)
                except (json.JSONDecodeError, TypeError):
                    kwargs['key_features'] = []
            else:
                kwargs['key_features'] = key_features

        product = serializer.save(**kwargs)

        images = self.request.FILES.getlist('additional_images')
        if images:
            existing_count = product.images.count()
            for i, img in enumerate(images[:max(0, 8 - existing_count)]):
                ProductImage.objects.create(product=product, image=img, order=existing_count + i)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_product_image(request, image_id):
    try:
        img = ProductImage.objects.get(id=image_id)
        logger.info(f"Product image deleted: id={image_id} from {request.META.get('REMOTE_ADDR')}")
        img.delete()
        return Response({'message': 'Image deleted'})
    except ProductImage.DoesNotExist:
        return Response({'error': 'Image not found'}, status=404)


class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all()
    serializer_class = DealSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        qs = Deal.objects.all()
        active_only = self.request.query_params.get('active')
        if active_only == 'true':
            qs = qs.filter(active=True)
        return qs


class TopPickViewSet(viewsets.ModelViewSet):
    queryset = TopPick.objects.filter(active=True)
    serializer_class = TopPickSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminUser()]


def get_or_create_cart(request):
    session_key = request.headers.get('X-Cart-Session')
    if not session_key:
        session_key = str(uuid.uuid4())
    cart, _ = Cart.objects.get_or_create(session_key=session_key)
    return cart, session_key


@api_view(['GET'])
def get_cart(request):
    cart, session_key = get_or_create_cart(request)
    serializer = CartSerializer(cart)
    data = serializer.data
    data['session_key'] = session_key
    return Response(data)


@api_view(['POST'])
def add_to_cart(request):
    cart, session_key = get_or_create_cart(request)
    product_id = request.data.get('product_id')

    try:
        quantity = int(request.data.get('quantity', 1))
    except (TypeError, ValueError):
        return Response({'error': 'Invalid quantity'}, status=400)
    if quantity < 1 or quantity > 99:
        return Response({'error': 'Quantity must be between 1 and 99'}, status=400)

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        item.quantity += quantity
    else:
        item.quantity = quantity
    item.save()

    serializer = CartSerializer(cart)
    data = serializer.data
    data['session_key'] = session_key
    return Response(data)


@api_view(['PUT'])
def update_cart_item(request, item_id):
    cart, session_key = get_or_create_cart(request)
    try:
        item = CartItem.objects.get(id=item_id, cart=cart)
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=404)

    try:
        quantity = int(request.data.get('quantity', 1))
    except (TypeError, ValueError):
        return Response({'error': 'Invalid quantity'}, status=400)
    if quantity < 0 or quantity > 99:
        return Response({'error': 'Quantity must be between 0 and 99'}, status=400)

    if quantity <= 0:
        item.delete()
    else:
        item.quantity = quantity
        item.save()

    serializer = CartSerializer(cart)
    data = serializer.data
    data['session_key'] = session_key
    return Response(data)


@api_view(['DELETE'])
def remove_from_cart(request, item_id):
    cart, session_key = get_or_create_cart(request)
    try:
        item = CartItem.objects.get(id=item_id, cart=cart)
        item.delete()
    except CartItem.DoesNotExist:
        pass

    serializer = CartSerializer(cart)
    data = serializer.data
    data['session_key'] = session_key
    return Response(data)


@ratelimit(key='ip', rate='10/m', method='POST', block=True)
@api_view(['POST'])
def checkout(request):
    cart, session_key = get_or_create_cart(request)
    items = cart.items.all()

    if not items.exists():
        return Response({'error': 'Cart is empty'}, status=400)

    customer_name = request.data.get('customer_name')
    customer_email = request.data.get('customer_email')
    customer_phone = request.data.get('customer_phone')
    fulfillment_type = request.data.get('fulfillment_type')
    delivery_address = request.data.get('delivery_address', '')
    delivery_lat = request.data.get('delivery_lat')
    delivery_lng = request.data.get('delivery_lng')
    delivery_fee = request.data.get('delivery_fee', 0)
    notes = request.data.get('notes', '')

    if not all([customer_name, customer_email, customer_phone, fulfillment_type]):
        return Response({'error': 'Missing required fields'}, status=400)

    if not re.match(r'^[^@]+@[^@]+\.[^@]+$', customer_email):
        return Response({'error': 'Invalid email address'}, status=400)
    if not re.match(r'^[\d\s\+\-\(\)]{7,20}$', customer_phone):
        return Response({'error': 'Invalid phone number'}, status=400)
    if fulfillment_type not in ('delivery', 'collection'):
        return Response({'error': 'Invalid fulfillment type'}, status=400)
    if len(customer_name) < 2 or len(customer_name) > 200:
        return Response({'error': 'Name must be between 2 and 200 characters'}, status=400)

    if fulfillment_type == 'delivery' and not delivery_address:
        return Response({'error': 'Delivery address is required'}, status=400)

    subtotal = 0
    order_items_data = []
    for cart_item in items:
        product = cart_item.product
        price = product.deal_price if product.deal_price else product.price
        item_total = price * cart_item.quantity
        subtotal += item_total
        order_items_data.append({
            'product': product,
            'product_name': product.name,
            'quantity': cart_item.quantity,
            'price': price,
        })

    actual_delivery_fee = 0
    if fulfillment_type == 'delivery':
        from decimal import Decimal
        settings = DeliverySettings.get_settings()
        actual_delivery_fee = Decimal(str(delivery_fee))
        if actual_delivery_fee not in [settings.harare_fee, settings.outside_harare_fee]:
            actual_delivery_fee = settings.outside_harare_fee

    total = subtotal + actual_delivery_fee

    order = Order.objects.create(
        customer_name=customer_name,
        customer_email=customer_email,
        customer_phone=customer_phone,
        fulfillment_type=fulfillment_type,
        delivery_address=delivery_address,
        delivery_lat=delivery_lat,
        delivery_lng=delivery_lng,
        delivery_fee=actual_delivery_fee,
        total=total,
        notes=notes,
        status='awaiting_payment',
    )

    for item_data in order_items_data:
        OrderItem.objects.create(order=order, **item_data)

    logger.info(f"New order created: {order.order_number} by {customer_name} from {request.META.get('REMOTE_ADDR')}")

    from .services import initiate_paynow_payment

    frontend_url = os.environ.get('FRONTEND_URL', request.build_absolute_uri('/')[:-1])
    backend_url = os.environ.get('BACKEND_URL', request.build_absolute_uri('/')[:-1])
    return_url = f"{frontend_url}/payment-status/{order.order_number}"
    result_url = f"{backend_url}/api/payment/result/"

    payment_result = initiate_paynow_payment(order, return_url, result_url)

    if payment_result['success']:
        cart.items.all().delete()
        return Response({
            'order_number': order.order_number,
            'redirect_url': payment_result['redirect_url'],
            'total': str(order.total),
        }, status=201)
    else:
        order.delete()
        return Response({'error': payment_result.get('error', 'Payment initiation failed')}, status=400)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def payment_return(request):
    order_number = request.query_params.get('order')
    if not order_number:
        return Response({'error': 'Missing order number'}, status=400)

    try:
        order = Order.objects.get(order_number=order_number)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)

    from .services import check_paynow_payment, process_successful_payment

    result = check_paynow_payment(order)
    if result['paid']:
        process_successful_payment(order)

    from django.http import HttpResponseRedirect
    redirect_path = f"/payment-status/{order.order_number}"
    return HttpResponseRedirect(redirect_path)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def payment_result(request):
    reference = request.data.get('reference') or request.query_params.get('reference')
    if not reference:
        return Response({'ok': True})

    order = None
    try:
        order = Order.objects.get(order_number=reference)
    except Order.DoesNotExist:
        try:
            order = Order.objects.get(paynow_reference=reference)
        except Order.DoesNotExist:
            pass

    if not order:
        return Response({'ok': True})

    from .services import check_paynow_payment, process_successful_payment

    result = check_paynow_payment(order)
    if result['paid']:
        process_successful_payment(order)

    return Response({'ok': True})


@ratelimit(key='ip', rate='30/m', method='GET', block=True)
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def payment_status(request, order_number):
    try:
        order = Order.objects.get(order_number=order_number)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)

    from .services import check_paynow_payment, process_successful_payment

    if not order.payment_confirmed and order.paynow_poll_url:
        result = check_paynow_payment(order)
        if result['paid']:
            process_successful_payment(order)
            order.refresh_from_db()

    serializer = OrderSerializer(order)
    return Response({
        **serializer.data,
        'payment_confirmed': order.payment_confirmed,
    })


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = Order.objects.all()
        status_filter = self.request.query_params.get('status')
        fulfillment = self.request.query_params.get('fulfillment_type')
        search = self.request.query_params.get('search')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if fulfillment:
            qs = qs.filter(fulfillment_type=fulfillment)
        if search:
            qs = qs.filter(order_number__icontains=search) | qs.filter(customer_name__icontains=search)
        return qs

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=400)
        old_status = order.status
        order.status = new_status
        order.save()
        logger.info(f"Order {order.order_number} status changed: {old_status} -> {new_status} from {request.META.get('REMOTE_ADDR')}")
        return Response(OrderSerializer(order).data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_delivery_settings(request):
    settings = DeliverySettings.get_settings()
    return Response(DeliverySettingsSerializer(settings).data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_delivery_settings(request):
    settings = DeliverySettings.get_settings()
    serializer = DeliverySettingsSerializer(settings, data=request.data)
    if serializer.is_valid():
        serializer.save()
        logger.info(f"Delivery settings updated from {request.META.get('REMOTE_ADDR')}")
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_maps_api_key(request):
    import os
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))
    key = os.environ.get('Maps_Api', '')
    return Response({'key': key})
