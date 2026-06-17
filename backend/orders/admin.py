from django.contrib import admin

from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "total_amount", "created_at")
    search_fields = ("user__username",)
    list_filter = ("created_at",)
