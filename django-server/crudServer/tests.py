from django.test import Client, TestCase, override_settings
from django.urls import reverse
from .fake_elements import fake_element_list, test_urls_module
import json
import sys

class Status:
    HTTP_200_OK= 200
    HTTP_201_CREATED = 201
    HTTP_204_NO_CONTENT = 204
    HTTP_400_BAD_REQUEST = 400
    HTTP_404_NOT_FOUND = 404
    HTTP_500_INTERNAL_ERROR = 500

# Inject it into sys.modules
sys.modules["test_urls"] = test_urls_module

@override_settings(ROOT_URLCONF="test_urls")
class ElementsAPITestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.initial_element = fake_element_list[0]

    def test_get_all_elements(self):
        """Test: Get all elements"""
        response = self.client.get(reverse("fake-elements"))
        decoded_data = response.content.decode('utf-8')
        json_body = json.loads(decoded_data)
        self.assertEqual(response.status_code, Status.HTTP_200_OK)
        self.assertEqual(len(json_body), 3)

    def test_get_element_by_id(self):
        """Test: Get a specific element by ID (valid)"""
        response = self.client.get(reverse("fake-element", args=[self.initial_element.id]))
        decoded_data = response.content.decode('utf-8')
        json_body = json.loads(decoded_data)
        self.assertEqual(response.status_code, Status.HTTP_200_OK)
        self.assertEqual(json_body["name"], "Fake Element 1")

    def test_get_non_existing_element_by_id(self):
        """Test: Get a non-existing element by ID"""
        response = self.client.get(reverse("fake-element", args= [999]))
        self.assertEqual(response.status_code, Status.HTTP_404_NOT_FOUND)

    def test_create_new_element(self):
        """Test: Create a new element"""
        new_element = {"name": "New Element", "description": "New element description"}
        response = self.client.post(reverse("fake-elements"), data=new_element, format='json')
        decoded_data = response.content.decode('utf-8')
        json_body = json.loads(decoded_data)
        self.assertEqual(response.status_code, Status.HTTP_201_CREATED)
        self.assertEqual(json_body["name"], "New Element")

    def test_create_element_without_name(self):
        """Test: Create an element without a name"""
        new_element = {"missname": "no name", "description": "Missing prop"}
        response = self.client.post(reverse("fake-elements"), data=new_element, format='json')
        decoded_data = response.content.decode('utf-8')
        json_body = json.loads(decoded_data)
        self.assertEqual(response.status_code, Status.HTTP_400_BAD_REQUEST)
        self.assertTrue(json_body["error"])

    def test_update_existing_element(self):
        """Test: Fully update an existing element"""
        updated_element = {"name": "Updated Name", "description": "Updated description"}
        response = self.client.put(reverse("fake-element", args=[self.initial_element.id]), data=updated_element, format='json')
        decoded_data = response.content.decode('utf-8')
        json_body = json.loads(decoded_data)
        self.assertEqual(response.status_code, Status.HTTP_200_OK)
        self.assertEqual(json_body["name"], "Updated Name")

    def test_update_non_existing_element(self):
        """Test: Update a non-existing element"""
        updated_element = {"name": "Won't Exist"}
        response = self.client.put(reverse("fake-element", args= [999]), data=updated_element, format='json')
        self.assertEqual(response.status_code, Status.HTTP_404_NOT_FOUND)

    def test_partially_update_element(self):
        """Test: Partially update an existing element"""
        updated_element = {"name": "Partially Updated"}
        response = self.client.patch(reverse("fake-element", args=[self.initial_element.id]), data=updated_element, format='json')
        decoded_data = response.content.decode('utf-8')
        json_body = json.loads(decoded_data)
        self.assertEqual(response.status_code, Status.HTTP_200_OK)
        self.assertEqual(json_body["name"], "Partially Updated")

    def test_partially_update_non_existing_element(self):
        """Test: Partially update a non-existing element"""
        updated_element = {"name": "Ghost Element"}
        response = self.client.patch(reverse("fake-element", args= [999]), data=updated_element, format='json')
        self.assertEqual(response.status_code, Status.HTTP_404_NOT_FOUND)

    def test_delete_existing_element(self):
        """Test: Delete an existing element"""
        response = self.client.delete(reverse("fake-element", args=[self.initial_element.id]))
        self.assertEqual(response.status_code, Status.HTTP_204_NO_CONTENT)

    def test_delete_non_existing_element(self):
        """Test: Delete a non-existing element"""
        response = self.client.delete(reverse("fake-element", args= [999]))
        self.assertEqual(response.status_code, Status.HTTP_404_NOT_FOUND)

    def test_not_covered_request(self):
        """Test: HEAD request is not covered, get status=500 a non-existing element"""
        response = self.client.head(reverse("fake-element", args=[1]))
        self.assertEqual(response.status_code, Status.HTTP_500_INTERNAL_ERROR)