from django.urls import path

from .views import (
    CategoryListAPIView,
    OrderCreateAPIView,
    OrderListAPIView,
    ProductListAPIView,
    RazorpayOrderCreateAPIView,
    RazorpayVerifyPaymentAPIView,
)


urlpatterns = [
    path("categories/", CategoryListAPIView.as_view(), name="category-list"),
    path("products/", ProductListAPIView.as_view(), name="product-list"),
    path("create/", OrderCreateAPIView.as_view(), name="order-create"),
    path("list/", OrderListAPIView.as_view(), name="order-list"),
    path("razorpay/order/", RazorpayOrderCreateAPIView.as_view(), name="razorpay-order-create"),
    path("razorpay/verify/", RazorpayVerifyPaymentAPIView.as_view(), name="razorpay-payment-verify"),
]
