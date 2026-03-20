from django.db import models
import logging
import uuid

from .image_utils import compress_image

logger = logging.getLogger(__name__)


class Category(models.Model):
    CATEGORY_TYPES = [
        ('phone', 'Phone'),
        ('laptop', 'Laptop'),
        ('smartwatch', 'Smartwatch'),
        ('accessory', 'Accessory'),
        ('other', 'Other'),
    ]
    name = models.CharField(max_length=200)
    icon = models.CharField(max_length=50, default='Package')
    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPES, default='other')
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.image and hasattr(self.image, 'file'):
            try:
                self.image = compress_image(self.image)
            except Exception as e:
                logger.warning(f"Image compression failed for category '{self.name}': {e}")
        super().save(*args, **kwargs)


class Product(models.Model):
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('used', 'Used'),
        ('refurbished', 'Refurbished'),
    ]
    name = models.CharField(max_length=300)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    key_features = models.JSONField(default=list, blank=True)
    specifications = models.JSONField(default=dict, blank=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    badge = models.CharField(max_length=20, blank=True)
    stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='new')
    warranty = models.CharField(max_length=100, blank=True)
    brand = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.sku})"

    def save(self, *args, **kwargs):
        if self.image and hasattr(self.image, 'file'):
            try:
                self.image = compress_image(self.image)
            except Exception as e:
                logger.warning(f"Image compression failed for product '{self.name}': {e}")
        super().save(*args, **kwargs)

    @property
    def deal_price(self):
        deal = self.deals.filter(active=True).first()
        if deal:
            return deal.deal_price
        return None

    @property
    def active_deal(self):
        return self.deals.filter(active=True).first()


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image {self.order} for {self.product.name}"

    def save(self, *args, **kwargs):
        if self.image and hasattr(self.image, 'file'):
            try:
                self.image = compress_image(self.image)
            except Exception as e:
                logger.warning(f"Image compression failed for ProductImage {self.order}: {e}")
        super().save(*args, **kwargs)


class Deal(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='deals')
    deal_price = models.DecimalField(max_digits=10, decimal_places=2)
    save_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    active = models.BooleanField(default=True)
    end_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Deal on {self.product.name}: ${self.deal_price}"


class TopPick(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='top_picks')
    order = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Top Pick #{self.order}: {self.product.name}"


class Cart(models.Model):
    session_key = models.CharField(max_length=200, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart {self.session_key}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('awaiting_payment', 'Awaiting Payment'),
        ('paid', 'Paid'),
        ('processing', 'Processing'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('collected', 'Collected'),
        ('cancelled', 'Cancelled'),
    ]
    FULFILLMENT_CHOICES = [
        ('delivery', 'Delivery'),
        ('collection', 'Collection'),
    ]

    order_number = models.CharField(max_length=20, unique=True)
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    delivery_address = models.TextField(blank=True)
    delivery_lat = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    delivery_lng = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    fulfillment_type = models.CharField(max_length=20, choices=FULFILLMENT_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='awaiting_payment')
    total = models.DecimalField(max_digits=12, decimal_places=2)
    notes = models.TextField(blank=True)
    paynow_poll_url = models.URLField(blank=True, max_length=500)
    paynow_reference = models.CharField(max_length=200, blank=True)
    payment_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.order_number}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"LW-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)


class DeliverySettings(models.Model):
    harare_fee = models.DecimalField(max_digits=10, decimal_places=2, default=5.00)
    outside_harare_fee = models.DecimalField(max_digits=10, decimal_places=2, default=15.00)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Delivery Settings'
        verbose_name_plural = 'Delivery Settings'

    def __str__(self):
        return f"Delivery: Harare ${self.harare_fee}, Outside ${self.outside_harare_fee}"

    @classmethod
    def get_settings(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=300)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.product_name}"
