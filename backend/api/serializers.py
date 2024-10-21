from rest_framework import serializers
from .models import User, Token, Answer

class ReportSerializer(serializers.ModelSerializer):
    country = serializers.CharField(source="user.country")
    class Meta:
        model = Answer
        fields = ["is_correct", "country"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password", "country", "phone", "has_submitted"]


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ["token", "created_at", "expires_at", "user_id", "is_used"]

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ["user", "question", "answer", "is_correct"]