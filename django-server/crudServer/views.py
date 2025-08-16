# Genereated Llama genAI in lea chat of Brawe browser
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpRequest

from django.views.decorators.http import require_http_methods
from django.core.exceptions import ObjectDoesNotExist
from typing import Callable, Union
#from crudServer.models import Element
from django.views.decorators.csrf import csrf_exempt
import json

CallbackType = Callable[[HttpRequest], Union[JsonResponse, HttpResponse]]

class Element:
    id: int
    name: str
    description: str

    def __init__(self, id, name, description):
        self.id = id
        self.name = name
        self.description = description

    def toDict(self):
        return {"id": self.id, "name": self.name, "description": self.description}

def index(request):
    print('==> CRUD-server is running, port:8000')
    return HttpResponse("Hello, crud server")


# Initialize the variables
newElementCounter = 0
elements_array = [
    Element(1, "Element 1", "First element"),
    Element(2, "Element 2", "Second element")
]

#region httpRequest_methods

#@require_http_methods(["HEAD"])
def check_elements(request):
    print('==>Request: head')
    return HttpResponse()

# Create a view for getting all elements
def get_elements(request):
    print('==>Request: get all elements')
    res_data = [{"id": element.id, "name": element.name, "description": element.description} for element in elements_array]
    return JsonResponse(res_data, safe=False)

# Create a view for getting a single element by ID
@require_http_methods(["GET"])
def get_element(request: HttpRequest, id: int):
    try:
        found_elements = [x for x in elements_array if x.id == id]
        element = found_elements[0]
        return JsonResponse({"id": element.id, "name": element.name, "description": element.description})
    except ObjectDoesNotExist:
        return JsonResponse({"error": "Element not found"}, status=404)
    

# Create a view for creating a new element
#@require_http_methods(["POST"])
@csrf_exempt
def create_element(request: HttpRequest):
    global newElementCounter  # Access the newElementCounter variable
    try:
        print('post body =>', request.body)
        # decoded byte to string
        decoded_data = request.body.decode('utf-8')  # Convert bytes to string
        json_body = json.loads(decoded_data)  # Parse JSON
        
        if json_body["name"] == "":
           return JsonResponse({"error": "Name field is missing"}, status=400)
        
        element = Element(id=len(elements_array) + 1, name=json_body["name"], description=json_body["description"])
        newElementCounter += 1
        elements_array.append(element)
        print("Post request called {newElementCounter} times")
        return JsonResponse({"id": element.id, "name": element.name, "description": element.description}, status=201)
    except KeyError as keyErr:
        print('keyErr=' + keyErr)
        return JsonResponse({"error": "Name field is missing"}, status=400)
    except Exception as err:
        print("err=>", err)
        return JsonResponse({"error": "Failed to create element"}, status=500)

# updating an target element
def update_element(request: HttpRequest, id: int):
    try:
        found_elements = [x for x in elements_array if x.id == id]
        if len(found_elements) > 0:
            element = found_elements[0]
            decoded_data = request.body.decode('utf-8')
            json_body = json.loads(decoded_data)
            element.name = json_body["name"]
            element.description = json_body["description"]
            return JsonResponse({"id": element.id, "name": element.name, "description": element.description})
        else:
            return JsonResponse({"error": "Element not found"}, status=404)
    except KeyError:
        return JsonResponse({"error": "Name or description field is missing"}, status=400)
    except Exception as e:
        return JsonResponse({"error": "Failed to update element"}, status=500)

def patch_element(request: HttpRequest, id: int):
    try:
        found_elements = [x for x in elements_array if x.id == id]
        if found_elements:
            element = found_elements [0]
            decoded_data = request.body.decode('utf-8')
            json_body = json.loads(decoded_data)

            # Update only the fields that are present in the request body
            if "name" in json_body:
                element.name = json_body["name"]
            if "description" in json_body:
                element.description = json_body["description"]

            return JsonResponse({"id": element.id, "name": element.name, "description": element.description})
        else:
            return JsonResponse({"error": "Element not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": "Failed to update element"}, status=500)

def delete_element(request: HttpRequest, id: int):
    try:
        found_elements = [x for x in elements_array if x.id == id]
        if found_elements:
            element = found_elements [0]
            elements_array.remove(element)
            return JsonResponse({"message": "Element deleted successfully"})
        else:
            return JsonResponse({"error": "Element not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": "Failed to delete element"}, status=500)
  
#endregion

REQUEST_METHODS_DICT: dict[str, CallbackType] = {
    "GET": get_elements,
    "HEAD": check_elements,
    "POST": create_element,
    "PUT": update_element,
    "PATCH": patch_element,
    "DELETE": delete_element
}

@require_http_methods(["GET", "HEAD", "POST"])
def get_post_elements_handler(request: HttpRequest) -> HttpResponse:
    print('called request = ', request.method)
    try:
        if request.method in REQUEST_METHODS_DICT:
            return REQUEST_METHODS_DICT[request.method](request)
        else:
            return JsonResponse({"error": "Failed to execture method request:" + request.method + "That request is not implemented in backend side yet!"}, status=500)
    except Exception as e:
        return JsonResponse({"error": "Internal server error"}, status=500)
    
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def get_put_delete_element_handler(request: HttpRequest, id: int) -> HttpResponse:
    print('called request = ', request.method)
    try:
        if request.method in REQUEST_METHODS_DICT:
            return REQUEST_METHODS_DICT[request.method](request, id)
        else:
            return JsonResponse({"error": "Failed to execute method request:" + request.method + "That request is not implemented in backend side yet!"}, status=500)
    except Exception as e:
        return JsonResponse({"error": "Internal server error"}, status=500)