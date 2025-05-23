from django.urls import path
from .views import *

urlpatterns = [
    path('create/', CreatePackageView.as_view(), name='create-package'),
]