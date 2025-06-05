from django.urls import path
from .views import *

urlpatterns = [
    path('qrcodes/', TableQRCodeListView.as_view()),
]