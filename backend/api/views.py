from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Q
import uuid
import hashlib
import time
import json

from .models import Category, Product, ProductImage, Deal, TopPick, Cart, CartItem, Order, OrderItem
from .serializers import (
    CategorySerializer, ProductSerializer, DealSerializer,
    TopPickSerializer, CartItemSerializer, CartSerializer,
    OrderSerializer, ProductImageSerializer
)

admin_tokens = {}


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if token and token in admin_tokens:
            return True
        return request.user and request.user.is_staff


@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None and user.is_staff:
        token = hashlib.sha256(f"{username}{time.time()}".encode()).hexdigest()
        admin_tokens[token] = user.username
        return Response({'message': 'Login successful', 'username': user.username, 'token': token})
    return Response({'error': 'Invalid credentials or not an admin'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def admin_logout(request):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    admin_tokens.pop(token, None)
    return Response({'message': 'Logged out successfully'})


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def admin_check(request):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if token and token in admin_tokens:
        return Response({'authenticated': True, 'username': admin_tokens[token]})
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
    quantity = int(request.data.get('quantity', 1))

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

    quantity = int(request.data.get('quantity', 1))
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
    notes = request.data.get('notes', '')

    if not all([customer_name, customer_email, customer_phone, fulfillment_type]):
        return Response({'error': 'Missing required fields'}, status=400)

    total = 0
    order_items_data = []
    for cart_item in items:
        product = cart_item.product
        price = product.deal_price if product.deal_price else product.price
        item_total = price * cart_item.quantity
        total += item_total
        order_items_data.append({
            'product': product,
            'product_name': product.name,
            'quantity': cart_item.quantity,
            'price': price,
        })

    order = Order.objects.create(
        customer_name=customer_name,
        customer_email=customer_email,
        customer_phone=customer_phone,
        fulfillment_type=fulfillment_type,
        delivery_address=delivery_address,
        total=total,
        notes=notes,
        status='awaiting_payment',
    )

    for item_data in order_items_data:
        OrderItem.objects.create(order=order, **item_data)

    from .services import initiate_paynow_payment

    host = request.build_absolute_uri('/')[:-1]
    return_url = f"{host}/api/payment/return/?order={order.order_number}"
    result_url = f"{host}/api/payment/result/"

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
        order.status = new_status
        order.save()
        return Response(OrderSerializer(order).data)
