from rest_framework import serializers
from .models import Category, Product, ProductImage, Deal, TopPick, Cart, CartItem, Order, OrderItem


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'category_type', 'image', 'product_count']

    def get_product_count(self, obj):
        return obj.products.count()


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'order']

    def get_image(self, obj):
        if obj.image:
            return '/' + obj.image.url.lstrip('/')
        return None


class DealSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Deal
        fields = ['id', 'product', 'product_name', 'deal_price', 'save_percentage', 'active', 'end_date']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_type = serializers.CharField(source='category.category_type', read_only=True)
    deal_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    active_deal = DealSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'category_name', 'category_type', 'price', 'description',
                  'key_features', 'specifications', 'image', 'images', 'badge', 'stock', 'sku',
                  'condition', 'warranty', 'brand',
                  'deal_price', 'active_deal', 'created_at']

    def get_image(self, obj):
        if obj.image:
            return '/' + obj.image.url.lstrip('/')
        return None


class TopPickSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = TopPick
        fields = ['id', 'product', 'product_id', 'order', 'active']


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'session_key', 'items']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'customer_name', 'customer_email',
                  'customer_phone', 'delivery_address', 'fulfillment_type',
                  'status', 'total', 'notes', 'items', 'created_at', 'updated_at']
