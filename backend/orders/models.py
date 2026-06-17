from django.contrib.auth import get_user_model
from django.db import models


User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True, null=True)
    category = models.ForeignKey(
        Category,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="products",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Product({self.name} - ${self.price})"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField(blank=True)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    paid = models.BooleanField(default=False)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Delivery tracking fields
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    delivery_boy_name = models.CharField(max_length=100, blank=True, null=True)
    delivery_boy_phone = models.CharField(max_length=20, blank=True, null=True)
    current_location = models.CharField(max_length=255, blank=True, null=True)  # Can store lat,lng
    estimated_delivery_time = models.DateTimeField(blank=True, null=True)
    delivered_at = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        status = "Paid" if self.paid else "Pending"
        return f"Order({self.id}) - {self.user.username} - {self.total_amount} ({status})"
