from rest_framework import serializers
from .models import UserInfo, Secrets


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ('id', 'name', 'username', 'bio', 'password', 'profile_image')


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ('name', 'username', 'bio', 'password', 'profile_image')


class SecretsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Secrets
        fields = ("id", "secret", "by", "at")


class UserSecretsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Secrets
        fields = ("secret", "by")
