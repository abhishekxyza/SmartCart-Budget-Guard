from rest_framework import serializers


class BudgetSetSerializer(serializers.Serializer):
    monthly_limit = serializers.DecimalField(max_digits=10, decimal_places=2)


class BudgetStatusSerializer(serializers.Serializer):
    monthly_limit = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_spent = serializers.DecimalField(max_digits=12, decimal_places=2)
    remaining = serializers.DecimalField(max_digits=12, decimal_places=2)
    status = serializers.CharField()


from .models import BudgetHistory

class BudgetHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetHistory
        fields = ["id", "monthly_limit", "total_spent", "start_date", "end_date"]
