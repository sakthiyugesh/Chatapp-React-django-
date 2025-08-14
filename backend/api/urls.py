from django.urls import path
from .views import *

urlpatterns = [

    path('home/', home),
    path('user-lists/', user_list),
    path('message-lists/', ListMessageView.as_view()),
    path('chatinbox/<user_id>/', ChatInbox.as_view()),
    path('sent-message/', SentMessageView.as_view()),
    

    path("send-otp/", send_otp, name="send_otp"),
    path("verify-otp/", verify_otp, name="verify_otp"),
    path("logout/", logout, name="logout"),
]

