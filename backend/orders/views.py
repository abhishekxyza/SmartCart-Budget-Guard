from decimal import Decimal

from django.conf import settings
from django.db.models import Sum
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from budget.models import Budget
from .models import Category, Order, Product
from .serializers import (
    CategorySerializer,
    OrderCreateSerializer,
    OrderSerializer,
    ProductSerializer,
)
from .email_service import send_order_confirmation_emails


def _start_of_month(dt):
    return dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)


class ProductListAPIView(generics.ListAPIView):
    """List available grocery products."""

    permission_classes = [permissions.AllowAny]
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.order_by("name")

        category_id = self.request.query_params.get("category")
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset


class CategoryListAPIView(generics.ListAPIView):
    """List available product categories."""

    permission_classes = [permissions.AllowAny]
    serializer_class = CategorySerializer
    queryset = Category.objects.order_by("name")


class OrderCreateAPIView(generics.CreateAPIView):
    """Create a new order and enforce budget restrictions."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        total_amount = serializer.validated_data["total_amount"]

        # Calculate spent this month
        now = timezone.now()
        month_start = _start_of_month(now)
        spent_this_month = (
            Order.objects.filter(user=request.user, created_at__gte=month_start)
            .aggregate(total=Sum("total_amount"))
            .get("total")
            or Decimal("0")
        )

        # Ensure this math uses Decimal precision
        spent_this_month = Decimal(str(spent_this_month))
        total_amount = Decimal(str(total_amount))

        # If a budget is set, enforce it
        try:
            budget = request.user.budget
        except Budget.DoesNotExist:
            budget = None

        if budget:
            would_be = spent_this_month + total_amount
            if would_be > budget.monthly_limit:
                return Response(
                    {
                        "detail": "Budget exceeded. Cannot create order.",
                        "monthly_limit": str(budget.monthly_limit),
                        "total_spent": str(spent_this_month),
                        "attempted_order": str(total_amount),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            shipping_address=serializer.validated_data.get("shipping_address", ""),
            payment_method=serializer.validated_data.get("payment_method", ""),
            paid=bool(serializer.validated_data.get("payment_method")),
        )
        # Send confirmation emails
        send_order_confirmation_emails(order, request.user)
        out_serializer = OrderSerializer(order)
        return Response(out_serializer.data, status=status.HTTP_201_CREATED)


class OrderListAPIView(generics.ListAPIView):
    """List orders for authenticated user."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")


class RazorpayOrderCreateAPIView(APIView):
    """Create Razorpay order and return order details for frontend checkout."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            import razorpay
            amount = request.data.get("amount")
            if not amount:
                return Response(
                    {"detail": "Amount is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Convert amount to paise (Razorpay expects integer paise)
            amount_in_paise = int(float(amount) * 100)

            # Initialize Razorpay client
            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )

            # Create Razorpay order
            order_data = {
                "amount": amount_in_paise,
                "currency": "INR",
                "payment_capture": "1"
            }
            razorpay_order = client.order.create(data=order_data)

            return Response(
                {
                    "order_id": razorpay_order["id"],
                    "amount": razorpay_order["amount"],
                    "currency": razorpay_order["currency"],
                    "key_id": settings.RAZORPAY_KEY_ID
                },
                status=status.HTTP_200_OK
            )

        except ImportError:
            return Response(
                {"detail": "Razorpay integration is not available right now."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RazorpayVerifyPaymentAPIView(APIView):
    """Verify Razorpay payment and create order in system."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            import razorpay

            payment_data = {
                "razorpay_payment_id": request.data.get("razorpay_payment_id"),
                "razorpay_order_id": request.data.get("razorpay_order_id"),
                "razorpay_signature": request.data.get("razorpay_signature")
            }

            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )

            # Verify payment signature
            client.utility.verify_payment_signature(payment_data)

            # Create order in system after successful payment
            total_amount = float(request.data.get("amount")) / 100  # Convert back to rupees
            shipping_address = request.data.get("shipping_address", "")

            # Reuse budget check logic from OrderCreateAPIView
            now = timezone.now()
            month_start = _start_of_month(now)
            spent_this_month = (
                Order.objects.filter(user=request.user, created_at__gte=month_start)
                .aggregate(total=Sum("total_amount"))
                .get("total")
                or Decimal("0")
            )

            spent_this_month = Decimal(str(spent_this_month))
            total_amount_decimal = Decimal(str(total_amount))

            try:
                budget = request.user.budget
            except Budget.DoesNotExist:
                budget = None

            if budget:
                would_be = spent_this_month + total_amount_decimal
                if would_be > budget.monthly_limit:
                    return Response(
                        {
                            "detail": "Budget exceeded. Cannot create order.",
                            "monthly_limit": str(budget.monthly_limit),
                            "total_spent": str(spent_this_month),
                            "attempted_order": str(total_amount_decimal),
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            # Create order
            order = Order.objects.create(
                user=request.user,
                total_amount=total_amount_decimal,
                shipping_address=shipping_address,
                payment_method="razorpay",
                paid=True,
                razorpay_payment_id=payment_data["razorpay_payment_id"],
                razorpay_order_id=payment_data["razorpay_order_id"],
                status='confirmed',
            )

            # Send confirmation emails
            send_order_confirmation_emails(order, request.user)

            out_serializer = OrderSerializer(order)
            return Response(out_serializer.data, status=status.HTTP_201_CREATED)

        except ImportError:
            return Response(
                {"detail": "Razorpay integration is not available right now."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except razorpay.errors.SignatureVerificationError:
            return Response(
                {"detail": "Payment verification failed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
