from rest_framework import generics, permissions

from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    """Register a new user."""

    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
