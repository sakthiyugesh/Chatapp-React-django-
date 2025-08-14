from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from rest_framework.response import Response
from .serializers import *
from rest_framework.generics import GenericAPIView, ListAPIView, CreateAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
# Create your views here.

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.mail import send_mail
import random
from datetime import timedelta
from .models import EmailOTP
import json
from django.db.models import OuterRef,Subquery,Q


def home(request):
    return JsonResponse('home', safe=False)


@api_view(['get'])
def user_list(APIView):
    user = CustomUser.objects.all()
    serializer = UserSerializer(user, many=True)
    return Response(serializer.data)



class ListMessageView(ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):

        messages = Message.objects.all()
        serializer = self.serializer_class(messages, many=True)
        # return Response(serializer.data)
        return messages
    

class ChatInbox(ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']

        # Get the last message IDs for the user with their contacts
        last_message_ids = CustomUser.objects.filter(
            Q(sender__receiver=user_id) | Q(receiver__sender=user_id)  # Use OR for clarity
        ).distinct().annotate(
            last_msg=Subquery(
                Message.objects.filter(
                    Q(sender=OuterRef('id'), receiver=user_id) |
                    Q(receiver=OuterRef('id'), sender=user_id)  # Use OR for clarity
                ).order_by("-id")[:1].values_list('id', flat=True)
            )
        ).values_list("last_msg", flat=True)

        # Filter messages based on the last message IDs
        messages = Message.objects.filter(id__in=last_message_ids).order_by('id')
        return messages
    

class SentMessageView(CreateAPIView):
    serializer_class = MessageSerializer

    


@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    serializer = EmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    email = serializer.validated_data["email"]
    username = email.split("@")[0] 

    # Create user if not exists
    user, created = CustomUser.objects.get_or_create(
        email=email,
        defaults={"username": username}
    )

    # Generate OTP
    otp_code = str(random.randint(100000, 999999))
    EmailOTP.objects.create(
        user=user,
        otp=otp_code,
        expires_at=timezone.now() + timedelta(minutes=5)
    )

    # TODO: send email here
    print(f"DEBUG OTP for {email}: {otp_code}")  # For testing

    return Response({"message": "OTP sent to email"}, status=200)





@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    serializer = OTPVerifySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.validated_data['email']
    otp = serializer.validated_data['otp']

    try:
        user = CustomUser.objects.get(email=email)
        otp_entry = EmailOTP.objects.filter(user=user, otp=otp).last()

        if otp_entry and otp_entry.is_valid():
            refresh = RefreshToken.for_user(user) 
            access_token = refresh.access_token
            access_token['user_id'] = user.id
            access_token['email'] = user.email
            access_token['username'] = user.username
            # access_token['first_name'] = user.first_name
            # access_token['last_name'] = user.last_name
            return Response({
                "message": "OTP verified. Login success.",
                "access": str(access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
            }, status=200)
        else:
            return Response({"error": "Invalid or expired OTP"}, status=400)

    except CustomUser.DoesNotExist:
        return Response({"error": "CustomUser not found"}, status=404)


@api_view(['POST'])
def logout(request):
    try:
        refresh_token = request.data.get("refresh")
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logged out successfully"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)