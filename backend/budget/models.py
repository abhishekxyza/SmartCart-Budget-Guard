from django.contrib.auth import get_user_model
from django.db import models


User = get_user_model()


class Budget(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="budget")
    monthly_limit = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Budget({self.user.username}: {self.monthly_limit})"


class BudgetHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="budget_history")
    monthly_limit = models.DecimalField(max_digits=10, decimal_places=2)
    total_spent = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-end_date"]

    def __str__(self):
        return f"BudgetHistory({self.user.username}: {self.start_date.date()} to {self.end_date.date()})"
