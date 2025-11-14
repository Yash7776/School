from django.urls import path # type: ignore
from .views import RegisterView, LoginView, UserDetailView, FeedbackView, InstructionView, FeedbackDetailView, InstructionDetailView, UserManagementView, UserDetailManagementView
from rest_framework_simplejwt.views import TokenVerifyView # type: ignore

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('verify/', TokenVerifyView.as_view()),
    path('me/', UserDetailView.as_view()),
    path('feedback/', FeedbackView.as_view()),
    path('feedback/<int:pk>/', FeedbackDetailView.as_view()),
    path('instructions/', InstructionView.as_view()),
    path('instructions/<int:pk>/', InstructionDetailView.as_view()),
    path('users/', UserManagementView.as_view()),
    path('users/<int:pk>/', UserDetailManagementView.as_view()),
]
