from django.contrib.admin.widgets import AdminDateWidget
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from django.template.defaultfilters import time
from django.utils import timezone
from django.utils.timesince import timesince


class Member(models.Model):
    name = models.CharField(max_length=20)

    def initial(self):
        return self.username[0]

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    email = models.EmailField('email address', unique=True)
    bio = models.TextField(null=True)
    avatar = models.ImageField(null=True, default="view.png")
    username = models.CharField(max_length=75, unique=True)

    # USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['email',]


'''class Topic(models.Model):
    name = models.CharField(max_length=75)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name'''


# A forum is a room for discussions
class Forum(models.Model):
    user = get_user_model()
    host = models.ForeignKey(user,  on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=75)
    # topic = models.ForeignKey(Topic, on_delete=models.SET_NULL, null=True)
    description = models.CharField(max_length=75)
    participants = models.ManyToManyField(user, related_name='participants', blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def participants_total(self):
        return self.participants.count()

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Message(models.Model):
    user = get_user_model()  # gets current user
    author = models.ForeignKey(user, on_delete=models.CASCADE)
    # topic = models.ForeignKey(Topic, on_delete=models.CASCADE, null=True)
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE, null=True)
    body = models.TextField()
    #image = models.ImageField(null=True, default="view.png")
    # likes = models.IntegerField(null=True, blank=True)
    likes = models.ManyToManyField(user, related_name="likers")
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    def messages_total(self):
        pass

    def likes_total(self):
        return self.likes.count()

    def timesince(self):
        timesince_ = timesince(self.created)
        print("posted at", timesince_)
        return timesince_


    def __str__(self):
        return self.body

    class Meta:
        ordering = ['-created']


'''class Like(models.Model):
    User = get_user_model()
    message = models.ForeignKey(Message, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE, null=True)
    like_status = models.BooleanField()
    # number_of_likes = models.IntegerField(null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
'''


class MessageImage(models.Model):
    user = get_user_model()
    message = models.ForeignKey(Message, related_name="post", on_delete=models.CASCADE)
    image = models.ImageField(null=True)


class MessageComment(models.Model):
    User = get_user_model()
    commented = models.ForeignKey(User, on_delete=models.CASCADE, related_name="commented")
    commenter = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    message = models.ForeignKey(Message, on_delete=models.CASCADE, null=True)
    comment = models.TextField(blank=True, null=True)

    def comments_total(self):
        return self.comment.count()

    def __str__(self):
        return self.comment


class Leader(models.Model):
    User = get_user_model()
    leader = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    has_followers = models.BooleanField(default=False)
    followers = models.ManyToManyField(User, related_name="followers",  blank=True)

    def followers_total(self):
        return self.followers.count()

    def __str__(self):
        return str(self.has_followers)


class Post(models.Model):
    User = get_user_model()
    writer = models.ForeignKey(User, on_delete=models.CASCADE)
    # topic = models.ForeignKey(Topic, on_delete=models.CASCADE, null=True)
    message = models.TextField()
    title = models.CharField(max_length=75, default="untitled")
    description2 = models.CharField(max_length=75, null=True)
    # likes = models.IntegerField(null=True, blank=True)
    liker = models.ManyToManyField(User, related_name="liker")
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    @property
    def like_count(self):
        return self.liker.all().count()

    def __str__(self):
        return self.message


# NFMessage means Messages not connected to any forum
class NFMessage(models.Model):
    User = get_user_model()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    likes = models.ManyToManyField(User, related_name="loves")
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']
    @property
    def likes_total(self):
        return self.likes.all().count()

    def __str__(self):
        return self.message

    def timesince(self):
        timesince_ = timesince(self.created)
        print("posted at", timesince_)
        return timesince_


class NFMessageImage(models.Model):
    user = get_user_model()
    message = models.ForeignKey(NFMessage, related_name="nf_post", on_delete=models.CASCADE)
    image = models.ImageField(null=True)


class Question(models.Model):
    User = get_user_model()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.TextField()
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.question


class Answer(models.Model):
    User = get_user_model()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    # person = CustomUser.objects.get(id=1)
    questioner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="questioner")
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.TextField(default="Great")
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.answer

    def no_of_answers(self):
        return self.count()

class AnswerImage(models.Model):
    user = get_user_model()
    answer = models.ForeignKey(Answer, related_name="given_answer", on_delete=models.CASCADE)
    image = models.ImageField(null=True)


# Note: created, updated, and type are not to be set to null. Notifyee is
# also set to blank Change them when the database is recreated.
class Notification(models.Model):
    user = get_user_model()
    notifier = models.ForeignKey(user, related_name="notifier", on_delete=models.CASCADE)
    notifyee = models.ManyToManyField(user, blank=True, related_name="notified_person")
    item_type = models.CharField(max_length=50, blank=True)
    item_no = models.CharField(max_length=50, blank=True)
    notice = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True, null=True)
    updated = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.notice