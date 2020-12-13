from django.shortcuts import render
from .serializers import UserInfoSerializer, SignupSerializer, UserSecretsSerializer, SecretsSerializer
from .models import UserInfo, Secrets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
# from django.contrib.sessions.models import Session
# Session.objects.all().delete()


class UserInfoView(generics.ListAPIView):
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoSerializer


class GetUserInfoView(APIView):
    serializer_class = UserInfoSerializer
    requested_username_argument = 'username'

    def get(self, request, format=None):
        requested_username = request.GET.get(self.requested_username_argument)
        if requested_username != None:
            user_info = UserInfo.objects.filter(username=requested_username)
            if user_info.exists():
                return Response(UserInfoSerializer(user_info[0]).data, status=status.HTTP_200_OK)

            return Response({'failure': "User does not exist"}, status=status.HTTP_403_FORBIDDEN)
        return Response({'failure': "Unauthorized User"}, status=status.HTTP_403_FORBIDDEN)


class LoginView(APIView):
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        username = request.data.get('username')
        password = request.data.get('password')

        user_info_result = UserInfo.objects.filter(
            username=username, password=password)
        if user_info_result.exists():
            user_info = user_info_result[0]
            self.request.session['username'] = username
            self.request.session['password'] = password

            return Response({'username': username, 'password': password}, status=status.HTTP_200_OK)

        return Response({'error': 'Wrong credential information'}, status=status.HTTP_404_NOT_FOUND)


class SignupView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = SignupSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        user_info = self.serializer_class(data=request.data)
        if user_info.is_valid():
            user_info.save()

            user_data = UserInfo.objects.filter(
                username=user_info.data.get('username')).first()

            self.request.session['username'] = user_info.data.get('username')
            self.request.session['password'] = user_info.data.get('password')
            return Response(SignupSerializer(user_data).data, status=status.HTTP_201_CREATED)
        else:
            return Response(user_info.errors, status=status.HTTP_200_OK)


class GetData(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            "username": self.request.session.get("username"),
            "password": self.request.session.get("password"),
        }
        return JsonResponse(data, status=status.HTTP_200_OK)


class LogOutView(APIView):
    def get(self, request, format=None):
        if 'username' in self.request.session and 'password' in self.request.session:
            self.request.session.pop('username')
            self.request.session.pop('password')

            return Response({'success': 'Logged out'}, status=status.HTTP_200_OK)


class UpdateUserInfoView(generics.ListCreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = UserInfoSerializer
    queryset = UserInfo.objects.all()

    def post(self, request, format=None):
        user_data_result = UserInfo.objects.filter(
            username=request.data.get('username'))
        if not user_data_result.exists():
            return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

        user_data = user_data_result[0]
        if request.data.get('profile_image') != None:
            user_data.profile_image = request.data.get('profile_image')
        user_data.name = request.data.get('name')
        user_data.bio = request.data.get('bio')
        user_data.password = request.data.get('password')

        user_data.save(update_fields=["name", "bio", 'password', "profile_image"]) if request.data.get(
            'profile_image') != None else user_data.save(update_fields=["name", "bio", 'password'])

        return Response(UserInfoSerializer(user_data).data, status=status.HTTP_201_CREATED)


class AddSecret(APIView):
    def post(self, request, format=None):
        secret = UserSecretsSerializer(data=request.data)
        if secret.is_valid():
            secret.save()

            secrets = Secrets.objects.filter(
                by=request.data.get('by')).order_by("-at")

            return Response(SecretsSerializer(secrets, many=True).data, status=status.HTTP_201_CREATED)

        return Response(secret.errors, status=status.HTTP_200_OK)


class GetSecrets(APIView):
    def post(self, request, format=None):
        secrets = Secrets.objects.filter(
            by=request.data.get('by')).order_by("-at")
        if secrets.exists():
            return Response(SecretsSerializer(secrets, many=True).data, status=status.HTTP_200_OK)

        return Response({"error": "You have no secrets"}, status=status.HTTP_404_NOT_FOUND)


class DeleteSecret(APIView):
    def post(self, request, format=None):
        secret_to_delete = Secrets.objects.filter(
            id=request.data.get('id')).first()
        secret_to_delete.delete()

        secrets = Secrets.objects.filter(
            by=request.data.get("username")).order_by("-at")
        if secrets.exists():
            return Response(SecretsSerializer(secrets, many=True).data, status=status.HTTP_200_OK)

        return Response({"error": "You have no secrets"}, status=status.HTTP_404_NOT_FOUND)
