from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, Feedback, Instruction

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role']

class UserSerializer(serializers.ModelSerializer):
    profiles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profiles']

    def get_profiles(self, obj):
        profiles = UserProfile.objects.filter(user=obj)
        return UserProfileSerializer(profiles, many=True).data


# Feedback and Instruction Serializers

class FeedbackSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Feedback
        fields = ['id', 'student', 'student_name', 'content', 'created_at']

    def get_student_name(self, obj):
        return obj.student.username

class InstructionSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    teacher = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Instruction
        fields = ['id', 'teacher', 'teacher_name', 'content', 'created_at']

    def get_teacher_name(self, obj):
        return obj.teacher.username  # or obj.teacher.get_full_name() or obj.teacher.email