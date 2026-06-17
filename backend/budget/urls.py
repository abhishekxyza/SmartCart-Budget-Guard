from django.urls import path

from .views import BudgetSetAPIView, BudgetStatusAPIView


urlpatterns = [
    path("set/", BudgetSetAPIView.as_view(), name="budget-set"),
    path("status/", BudgetStatusAPIView.as_view(), name="budget-status"),
]
