from rest_framework import serializers

from .models import Category, Order, Product


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = ["id", "name", "price", "description", "image_url", "category"]
        read_only_fields = ["id"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]
        read_only_fields = ["id"]


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "id",
            "total_amount",
            "shipping_address",
            "payment_method",
            "paid",
            "status",
            "delivery_boy_name",
            "delivery_boy_phone",
            "current_location",
            "estimated_delivery_time",
            "delivered_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "paid"]


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["total_amount", "shipping_address", "payment_method"]
