from decimal import Decimal

from django.db import models
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from orders.models import Order
from .models import Budget
from .serializers import BudgetSetSerializer, BudgetStatusSerializer


def _start_of_month(dt):
    return dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)


def calculate_budget_status(user, budget):
    now = timezone.now()
    month_start = _start_of_month(now)
    
    # Reset spending cycle if the limit was updated mid-month
    cycle_start = max(month_start, budget.updated_at)

    total_spent = (
        Order.objects.filter(user=user, created_at__gte=cycle_start)
        .aggregate(total=models.Sum("total_amount"))
        .get("total")
        or Decimal("0")
    )

    # Keep precision consistent using Decimal
    monthly_limit = Decimal(str(budget.monthly_limit))
    total_spent = Decimal(str(total_spent))

    remaining = monthly_limit - total_spent
    warning_threshold = monthly_limit * Decimal("0.8")

    if total_spent >= monthly_limit:
        status_str = "EXCEEDED"
    elif total_spent >= warning_threshold:
        status_str = "WARNING"
    else:
        status_str = "SAFE"

    return {
        "monthly_limit": monthly_limit,
        "total_spent": total_spent,
        "remaining": remaining,
        "status": status_str,
    }


class BudgetSetAPIView(generics.GenericAPIView):
    """Allow users to set or update their monthly budget."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BudgetSetSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        monthly_limit = serializer.validated_data["monthly_limit"]

        budget, _ = Budget.objects.update_or_create(
            user=request.user, defaults={"monthly_limit": monthly_limit}
        )

        status_data = calculate_budget_status(request.user, budget)
        return Response(status_data, status=status.HTTP_200_OK)


class BudgetStatusAPIView(generics.GenericAPIView):
    """Return the current budget status for the authenticated user."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BudgetStatusSerializer

    def get(self, request, *args, **kwargs):
        try:
            budget = request.user.budget
        except Budget.DoesNotExist:
            return Response(
                {"detail": "No budget set. Please set a budget first."},
                status=status.HTTP_404_NOT_FOUND,
            )

        status_data = calculate_budget_status(request.user, budget)
        return Response(status_data, status=status.HTTP_200_OK)
