from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'deals', views.DealViewSet)
router.register(r'top-picks', views.TopPickViewSet)
router.register(r'orders', views.OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', views.admin_login),
    path('auth/logout/', views.admin_logout),
    path('auth/check/', views.admin_check),
    path('cart/', views.get_cart),
    path('cart/add/', views.add_to_cart),
    path('cart/item/<int:item_id>/', views.update_cart_item),
    path('cart/item/<int:item_id>/remove/', views.remove_from_cart),
    path('checkout/', views.checkout),
    path('product-images/<int:image_id>/delete/', views.delete_product_image),
]
