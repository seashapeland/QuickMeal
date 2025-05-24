from django.urls import path
from .views import *

urlpatterns = [
    path('info/', get_user_info, name='get_user_info'),

]