from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("elements", views.get_post_elements_handler, name="requests_elementS"),
    path("element/<int:id>", views.get_put_delete_element_handler, name="requests_byIds"),
]