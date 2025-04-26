# manager/serializers.py

from rest_framework import serializers
from .models import AdminInfo

class AdminInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminInfo
        fields = ['admin_id', 'username', 'role', 'status', 'last_login_time', 'created_at']
