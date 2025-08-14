from .models import *
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers



class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'id']


# class MessageSerializer(ModelSerializer):
#     class Meta:
#         model = Message
#         fields = "__all__"

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'id']


class MessageSerializer(ModelSerializer):
    sender_profile = ProfileSerializer(source='sender', read_only=True)
    receiver_profile = ProfileSerializer(source='receiever', read_only=True)

    class Meta:
        model = Message
        fields = "__all__"

    


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
