from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("elements", views.get_post_elements_handler, name="all_elements")
]