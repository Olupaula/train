from django.urls import path
from . import views

urlpatterns = [
    path('', views.profile, name='profile'),
    path('employment_credential/', views.employmentCredential, name="employment_credential"),
    path('update_employment_credential/', views.updateEmploymentCredential, name='update_employment_credential'),
    path('delete_employment_credential/', views.deleteEmploymentCredential, name='delete_employment_credential'),
    path('education_credential/', views.educationCredential, name="education_credential"),
    path('delete_education_credential/', views.deleteEducationCredential, name='delete_education_credential'),
    path('update_education_credential', views.updateEducationCredential, name="update_education_credential"),
    path('location_credential/', views.locationCredential, name="location_credential"),
    path('update_location_credential/', views.updateLocationCredential, name="update_location_credential"),
    path('delete_location_credential/', views.deleteLocationCredential, name='delete_location_credential'),

    # these routes should go to profile
    path("answer_question/", views.answerQuestions, name="answer_question"),
    path("user_questions/", views.userQuestions, name="user_questions"),
    path("answers_to_user/", views.answersToUser, name="answers_to_user"),
    path("posts_by_user/", views.postsByUser, name="posts_by_user"),
    path("followers_of_user/", views.followersOfUser, name="followers_of_user"),
    path("followings_of_user/", views.followingsOfUser, name="followings_of_user"),
    path("edit_profile/<str:user_id>", views.edit_profile, name="edit_profile"),

]
