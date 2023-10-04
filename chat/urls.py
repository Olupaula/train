from django.urls import path, include
from . import views
# from .views import LoginView, RegisterForm
urlpatterns = [
    path("", views.home, name="home"),
    path("group_chat/", views.groupChat, name="group_chat"),
    path("notifications/", views.notifications, name="notifications"),
    path("notifications_update/", views.notifications_update, name="notifications_update"),
    path("register_user", views.registrationPage, name="register_user"),
    path("login/", views.loginPage, name="login"),
    path("logout/", views.logoutPage, name="logout"),
    path("verification/", views.verification, name='verification'),
    path('activate/<uidb64>/<token>', views.activate, name='activate'),
    path('join_forum/', views.joinForum, name='join_forum'),
    path('create_forum/', views.createForum, name="create_forum"),
    path('forum/<str:pk>', views.forum, name="forum"),
    path('update_like/<str:post_id>/<str:forum_id>/<str:source>', views.updateLike, name="update_like"),
    path("update_all_users_like/", views.updateAllUsersLikes, name="update_all_users_like"),
    path('update_followers/<str:author_id>/<str:forum_id>/<str:source>', views.updateFollowers, name="update_followers"),
    path('comments/<str:post_id>/', views.comments, name="comments"),
    path('create/', views.create, name="create"),
    path('notification2/<int:num_posts>/', views.notifications_update2, name="notification2"),
    path('notification3/', views.notifications_update3, name="notification3"),
    path('like_unlike/', views.like_unlike_post, name='like_unlike'),
    path("to_be", views.to_be_deleted, name='to_be'),
    path("create_new_message/", views.createNewMessage, name="create_new_message"),
    path("last_message_others/<str:user_id>/", views.displayLastMessageByOthers, name="last_message_others"),
    path("delete_message/<str:pk>/", views.deleteMessage, name="delete_message"),
    path("edit_message/<str:post_id>/", views.editMessage, name="edit_message"),
    path("questions/", views.questions, name='questions'),
    path("answers/<str:question_id>", views.answers, name='answers'),
    path("blog/<slug:person>/<str:item_type>/<int:item_no>", views.blog_answer, name="blog"),
    path("read_unread_notifications/", views.readUnreadNotification, name="read_unread_notifications"),
    path("update_unread_notifications/", views.updateUnreadNotifications, name="update_unread_notifications"),
    path("load_home/", views.loadHome, name="load_home")

    # path('profile/', views.profile, name="profile"),
    # path('create_topic', views.createTopic, name="create_topic"),
    # path('forum_topic', views.forumTopic, name='forum_topic')
    # path("login", LoginView.as_view(), name="login"), I don't really know class views
    # path("register_user", views.RegisterView.as_view(), name="register_user")
]
