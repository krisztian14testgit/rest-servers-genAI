from django.db import models

# IT is using sqlite3, django.db refer sqLite in settings.py
class Element(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
