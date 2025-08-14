from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
# Create your models here.



class CustomUser(AbstractUser):
    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)

    EMAIL_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username
    
    # def tokens(self):
    #     refresh_token = RefreshToken.for_user(self)
    #     return{
    #         "refresh":str(refresh_token),
    #         "access":str(refresh_token.access_token)
    #     }
    


    
    


class Message(models.Model):
    chat = models.CharField(max_length=100, null=True, blank=True)
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE ,related_name='sender' )
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE ,related_name='receiver' )
    date_time = models.DateTimeField(auto_now_add=True)

    @property
    def sender_profile(self):
        user = CustomUser.objects.get(username=self.sender)

    @property
    def receiver_profile(self):
        user = CustomUser.objects.get(username=self.receiver)

    def __str__(self):
        return f"{self.sender.username} to {self.receiver.username}"





class EmailOTP(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_valid(self):
        return timezone.now() <= self.expires_at

    def __str__(self):
        return f"OTP for {self.user.email} - {self.otp}"
