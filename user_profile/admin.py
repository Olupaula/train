from django.contrib import admin
from .models import (
    EducationCredential, Profile, LocationCredential, EmploymentCredential
)

admin.site.register(EducationCredential)
admin.site.register(Profile)
admin.site.register(LocationCredential)
admin.site.register(EmploymentCredential)

