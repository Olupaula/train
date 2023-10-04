from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model


class EmploymentCredential(models.Model):
    User = get_user_model()
    user_em = models.OneToOneField(User, on_delete=models.CASCADE, related_name="user_em", null=True)
    position = models.CharField(max_length=75)
    company_organization = models.CharField(max_length=75)
    start_year = models.DateField(default="2020-02-04")
    end_year = models.DateField(null=True, blank=True)
    currently_work_here = models.BooleanField()

    def start_year_(self):
        year = self.start_year.year
        month = self.start_year.month
        day = self.start_year.day
        # print("year=", year)
        return {'year': year, 'month': month, 'day': day}
        # return year

    def end_year_(self):
        if self.end_year is not None:
            year = self.end_year.year
            month = self.end_year.month
            day = self.end_year.day
            # print("year=", year)
            return {'year': year, 'month': month, 'day': day}
        else:
            return None

    def __str__(self):
        return self.position


class EducationCredential(models.Model):
    User = get_user_model()
    user_ed = models.OneToOneField(User, on_delete=models.CASCADE, related_name="user_ed", null=True)
    primary_major = models.CharField(max_length=75)
    secondary_major = models.CharField(max_length=75)
    degree_type = models.CharField(max_length=75)

    def __str__(self):
        return self.degree_type


class LocationCredential(models.Model):
    User = get_user_model()
    user_lo = models.OneToOneField(User, on_delete=models.CASCADE, related_name="user_lo", null=True)
    location = models.CharField(max_length=75)
    start_year = models.DateField()
    end_year = models.DateField(null=True, blank=True)
    currently_live_here = models.BooleanField()

    def __str__(self):
        return self.location


class Profile(models.Model):
    User = get_user_model()
    user_pr = models.OneToOneField(User, on_delete=models.CASCADE, related_name="user_pr", null=True)
    profile_credential = models.CharField(max_length=75)
    bio = models.CharField(max_length=75)

    def __str__(self):
        return self.bio
