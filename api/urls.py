from django.urls import path
from .views import UserInfoView, LoginView, GetUserInfoView, SignupView, GetData, LogOutView, AddSecret, GetSecrets, UpdateUserInfoView, DeleteSecret

urlpatterns = [
    path('users', UserInfoView.as_view()),
    path('signup', SignupView.as_view()),
    path('login', LoginView.as_view()),
    path('get-user', GetUserInfoView.as_view()),
    path('update-user', UpdateUserInfoView.as_view()),
    path('get-user-data', GetData.as_view()),
    path('logout', LogOutView.as_view()),
    path('add-secrets', AddSecret.as_view()),
    path('get-secrets', GetSecrets.as_view()),
    path('delete-secret', DeleteSecret.as_view()),
]
