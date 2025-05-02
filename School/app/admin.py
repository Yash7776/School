from django.contrib import admin
from django.contrib.auth.models import User
from .models import UserProfile, Feedback, Instruction


# Register your models here.
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')
    search_fields = ('user__username', 'role')
    list_filter = ('role',)

class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('student', 'content', 'created_at')
    search_fields = ('student__username', 'content')
    list_filter = ('created_at',)

class InstructionAdmin(admin.ModelAdmin):
    list_display = ('teacher', 'content', 'created_at')
    search_fields = ('teacher__username', 'content')
    list_filter = ('created_at',)

# Register models
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Feedback, FeedbackAdmin)
admin.site.register(Instruction, InstructionAdmin)