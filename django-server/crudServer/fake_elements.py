from django.http import HttpResponse, JsonResponse, HttpRequest, QueryDict
from django.urls import path
from .views import Element
import types
import json

fake_element_list = [
    Element(id=1, name="Fake Element 1", description="First element"),
    Element(id=2, name="Fake Element 2", description="Second element"),
    Element(id=3, name="Fake Element 3", description="Third element")
]

#region my written codes
"""
def fake_elements_requets(request: HttpRequest):
    print('fake_elements_request takes over')
    if request.method == "GET":
        json_str = str([x.toJson() for x in fake_element_list])
        return JsonResponse(json_str, status=200, safe=False)


def fake_element_handler(request: HttpRequest, id: int):
    print('fake_element_handler takes over mocked http requests')    
    if request.method == "GET":
        return JsonResponse(fake_element_list[0].toJson(), status=200, safe=False)
    
    return JsonResponse({"error": "not covered that request"}, status=500)
"""
#endregion

#region Generataed code by LEO
# Fake data for testing
fake_element_asDict_list = [
    {"id": 1, "name": "Fake Element 1", "description": "Description 1"},
    {"id": 2, "name": "Fake Element 2", "description": "Description 2"},
    {"id": 3, "name": "Fake Element 3", "description": "Description 3"},
]

def gen_fake_elements_request(request: HttpRequest):
    print('fake_elements_request: api/elements')
    if request.method == "GET":
        return JsonResponse(fake_element_asDict_list, status=200, safe=False)
    elif request.method == "POST":
        try:
            decoded_body = request.body.decode('utf-8').replace('\r\n', '\n')
        except json.JSONDecodeError as e:
            print('Error=', e)
        
        if "missname" in decoded_body:
            return JsonResponse({"error": "Creating request: name prop is missing!"}, status=400)
        
        new_element = {"name": "New Element", "description": "New element description"}
        new_element["id"] = len(fake_element_asDict_list) + 1
        return JsonResponse(new_element, status=201)
    else:
        return JsonResponse({"error": "not covered that request"}, status=500)

def gen_fake_element_handler(request: HttpRequest, id: int):
    print('fake_element_handler: api/element')
    try:
        element = next(filter(lambda x: x["id"] == id, fake_element_asDict_list))
    except StopIteration:
        return JsonResponse({"error": "Element not found"}, status=404)

    # TODO: switch case - math pattern on py3.10
    if request.method == "GET":
        return JsonResponse(element, status=200, safe=False)
    elif request.method == "PUT":
        updated_element = {"name": "Updated Name", "description": "Updated description"}
        return JsonResponse(updated_element, status=200, safe=False)
    elif request.method == "PATCH":
        updated_element = {"name": "Partially Updated"}
        return JsonResponse(updated_element, status=200, safe=False)
    elif request.method == "DELETE":
        return JsonResponse({"message": "Element deleted successfully"}, status=204)
    else:
        return JsonResponse({"error": "not covered that request"}, status=500)
#endregion

# Create a fake module
test_urls_module = types.ModuleType("test_urls")
test_urls_module.urlpatterns = [
    path("elements/", gen_fake_elements_request, name="fake-elements"),
    path("elements/<int:id>/", gen_fake_element_handler, name="fake-element"),
]