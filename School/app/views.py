from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import UserProfile, Feedback, Instruction
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer, FeedbackSerializer, InstructionSerializer
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        # Check if all required fields are present
        required_fields = ['username', 'email', 'password', 'confirm_password', 'role']
        missing_fields = [field for field in required_fields if field not in request.data]
        
        if missing_fields:
            return Response({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=status.HTTP_400_BAD_REQUEST)

        username = request.data['username']
        email = request.data['email']
        password = request.data['password']
        confirm_password = request.data['confirm_password']
        role = request.data['role']

        # Validate password confirmation
        if password != confirm_password:
            return Response({
                'error': 'Passwords do not match'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate role
        if role not in ['Student', 'Teacher', 'Headmaster']:
            return Response({
                'error': 'Invalid role. Role must be either Student, Teacher, or Headmaster'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if username already exists
        if User.objects.filter(username=username).exists():
            return Response({
                'error': 'Username already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            return Response({
                'error': 'Email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        UserProfile.objects.create(user=user, role=role)

        return Response({
            "message": "User registered successfully. Please login using your credentials"
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        # Check if required fields are present
        required_fields = ['username', 'password']
        missing_fields = [field for field in required_fields if field not in request.data]
        
        if missing_fields:
            return Response({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=status.HTTP_400_BAD_REQUEST)

        username = request.data['username']
        password = request.data['password']
        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            profiles = UserProfile.objects.filter(user=user)
            roles = [p.role for p in profiles]

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'roles': roles,
                'username': user.username
            })
        else:
            return Response({
                'error': 'Invalid username or password'
            }, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


# Feedback and Instruction Views

class FeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = UserProfile.objects.get(user=request.user).role
        print(role)
        if role == 'Teacher' or role == 'Headmaster':
            feedbacks = Feedback.objects.all()
            
            # Search functionality
            search_query = request.query_params.get('search', None)
            if search_query:
                feedbacks = feedbacks.filter(
                    content__icontains=search_query
                ) | feedbacks.filter(
                    student__username__icontains=search_query
                )
            
            return Response(FeedbackSerializer(feedbacks, many=True).data)
        return Response({'error': 'Access Denied'}, status=403)

    def post(self, request):
        role = UserProfile.objects.get(user=request.user).role
        print(role)
        if role == 'Student':
            serializer = FeedbackSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(student=request.user)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        return Response({'error': 'Only students can submit feedback'}, status=403)

class FeedbackDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        role = UserProfile.objects.get(user=request.user).role
        if role != 'Headmaster':
            return Response({'error': 'Only headmaster can edit feedback'}, status=403)
        
        try:
            feedback = Feedback.objects.get(pk=pk)
        except Feedback.DoesNotExist:
            return Response({'error': 'Feedback not found'}, status=404)
        
        serializer = FeedbackSerializer(feedback, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        role = UserProfile.objects.get(user=request.user).role
        if role != 'Headmaster':
            return Response({'error': 'Only headmaster can delete feedback'}, status=403)
        
        try:
            feedback = Feedback.objects.get(pk=pk)
            feedback.delete()
            return Response({'message': 'Feedback deleted successfully'}, status=200)
        except Feedback.DoesNotExist:
            return Response({'error': 'Feedback not found'}, status=404)


class UserManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = UserProfile.objects.get(user=request.user).role
        if role != 'Headmaster':
            return Response({'error': 'Only headmaster can access user management'}, status=403)
        
        # Get all users with their profiles
        users = User.objects.all()
        user_data = []
        
        for user in users:
            profile = UserProfile.objects.filter(user=user).first()
            user_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': profile.role if profile else 'No Role',
                'date_joined': user.date_joined,
                'last_login': user.last_login
            })
        
        return Response(user_data, status=200)


class UserDetailManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        role = UserProfile.objects.get(user=request.user).role
        if role != 'Headmaster':
            return Response({'error': 'Only headmaster can edit users'}, status=403)
        
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        # Update user fields
        if 'username' in request.data:
            # Check if username already exists (excluding current user)
            if User.objects.filter(username=request.data['username']).exclude(pk=pk).exists():
                return Response({'error': 'Username already exists'}, status=400)
            user.username = request.data['username']
        
        if 'email' in request.data:
            # Check if email already exists (excluding current user)
            if User.objects.filter(email=request.data['email']).exclude(pk=pk).exists():
                return Response({'error': 'Email already exists'}, status=400)
            user.email = request.data['email']
        
        if 'password' in request.data and request.data['password']:
            user.set_password(request.data['password'])
        
        user.save()
        
        # Update role if provided
        if 'role' in request.data:
            profile = UserProfile.objects.filter(user=user).first()
            if profile:
                profile.role = request.data['role']
                profile.save()
            else:
                UserProfile.objects.create(user=user, role=request.data['role'])
        
        return Response({
            'message': 'User updated successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': UserProfile.objects.get(user=user).role
            }
        }, status=200)

    def delete(self, request, pk):
        role = UserProfile.objects.get(user=request.user).role
        if role != 'Headmaster':
            return Response({'error': 'Only headmaster can delete users'}, status=403)
        
        # Prevent headmaster from deleting themselves
        if request.user.id == pk:
            return Response({'error': 'You cannot delete your own account'}, status=400)
        
        try:
            user = User.objects.get(pk=pk)
            username = user.username
            user.delete()
            return Response({'message': f'User {username} deleted successfully'}, status=200)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

class InstructionView(APIView):

    permission_classes = [IsAuthenticated]
    def get(self, request):
        role = UserProfile.objects.get(user=request.user).role
        if role in ['Student', 'Headmaster']:
            instructions = Instruction.objects.all()
            
            # Search functionality
            search_query = request.query_params.get('search', None)
            if search_query:
                instructions = instructions.filter(
                    content__icontains=search_query
                ) | instructions.filter(
                    teacher__username__icontains=search_query
                )
            
            return Response(InstructionSerializer(instructions, many=True).data)
        return Response({'error': 'Access Denied'}, status=403)

    def post(self, request):
        role = UserProfile.objects.get(user=request.user).role
        if role in ['Teacher', 'Headmaster']:
            serializer = InstructionSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(teacher=request.user)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        return Response({'error': 'Only teachers and headmasters can post instructions'}, status=403)

class InstructionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        role = UserProfile.objects.get(user=request.user).role
        if role != 'Headmaster':
            return Response({'error': 'Only headmaster can edit instructions'}, status=403)
        
        try:
            instruction = Instruction.objects.get(pk=pk)
        except Instruction.DoesNotExist:
            return Response({'error': 'Instruction not found'}, status=404)
        
        serializer = InstructionSerializer(instruction, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        role = UserProfile.objects.get(user=request.user).role
        if role != 'Headmaster':
            return Response({'error': 'Only headmaster can delete instructions'}, status=403)
        
        try:
            instruction = Instruction.objects.get(pk=pk)
            instruction.delete()
            return Response({'message': 'Instruction deleted successfully'}, status=200)
        except Instruction.DoesNotExist:
            return Response({'error': 'Instruction not found'}, status=404)
