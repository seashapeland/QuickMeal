from django.shortcuts import render
from django.http import JsonResponse

def get_user_info(request):
    return JsonResponse({
        "username": "曲辰",
        "phone": "138****5678"
    }, json_dumps_params={'ensure_ascii': False})
