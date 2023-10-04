import random

from django.contrib import messages
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib.sites.shortcuts import get_current_site
from django.db.models import Q
from django.shortcuts import render, redirect, reverse, get_object_or_404
from django.http import JsonResponse
from django.core import serializers
from django.http import HttpResponse
# from .ml_codes.tweet2 import SentimentAnalysis
from django.template.loader import render_to_string
from django.urls import reverse_lazy
from .backends import EmailBackend
from user_profile.models import EmploymentCredential

from .models import (
    Member,
    CustomUser,
    Forum,
    Message,
    Leader,
    MessageComment,
    Post,
    MessageImage,
    Question,
    Answer,
    AnswerImage,
    NFMessage,
    NFMessageImage,
    Notification
)
# Like
# Topic
# from django.contrib.auth import authenticate, login, logout
# from django.contrib.auth.forms import UserCreationForm
from .forms import (
    LoginForm,
    RegisterForm,
    MessageForm,
    MessageCommentForm,
    QuestionForm,
    NFMessageForm,
    AnswerForm
)

# TopicForm
# from django.contrib.auth import views as auth_views
# from django.views import generic
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.contrib.auth.models import User
from django.core.mail import EmailMessage
from .forms import CreateForumForm
from django.urls import reverse_lazy


# NB: Forum, Train and Room are all the same concept. That means where one is used, the others are also implied
# And they all mean the same and were used interchangeably.

# global variables (NB: Some of them are not been used. Trace them and delete them.)
current_forum = None  # the current forum in which the user is.
available_posts = None  # all post available in a forum.
no_of_likes = ""  # Total number of likes a person has.
like_status = False  # To know whether or not person likes the status of another
unread_notifications = 0  # notifications not yet read


# posts = None


def home(request):
    """
    The home page of the train app.
    :param request: a html request.
    :return: returns the home.html page and the accompanying data in a context
    """
    forums = Forum.objects.all()
    result = " "
    form = NFMessageForm()
    emc = EmploymentCredential.objects.all()
    global unread_notifications

    if request.method == 'POST':
        form = NFMessageForm(request.POST or None, request.FILES or None)
        files = request.FILES.getlist('images')
        print('message =', files)

        if form.is_valid():
            # creating the message and saving the images
            message = NFMessage.objects.create(author=request.user, message=request.POST.get('message'))

            for file in files:
                NFMessageImage.objects.create(message=message, image=file)

            # creating notification for  posts
            new_post_notice = Notification.objects.create(notifier=request.user,
                                                          item_no=message.id, item_type="post", notice=message.message)
            users = CustomUser.objects.all()
            for user in users:
                new_post_notice.notifyee.add(user)

            # print("message", message)
            print("message_type",  request.POST.get('message'))
            if request.POST.get('message') != "":
                unread_notifications = unread_notifications + 1
                # d = 2
                print(request)

            return redirect("home")

        else:
            return redirect("create_forum")

    comment_form = MessageCommentForm()
    comments = MessageComment.objects.all()
    notifications = Notification.objects.all()

    ''' if request.method == "POST":
        text = request.POST["text"]'''
    '''sentiment = SentimentAnalysis()
    result = sentiment.predictor([text])
    redirect("sentiment")'''

    posts = NFMessage.objects.all()
    posts = random.sample(list(posts),5) if posts.count() >= 5 else random.sample(list(posts), posts.count())
    images = NFMessageImage.objects.all()
    users = CustomUser.objects.all()

    context = {
        # 'result': result,
        'forums': forums,
        'login': False,
        'posts': posts,
        'comment_form': comment_form,
        'comments': comments,
        'images': images,
        'emc': emc,
        'users': users,
        # 'd': d,
        # 'unread_notifications': unread_notifications,
        #'notifications': notifications
        # 'question': question,

    }
    return render(request, 'base/home.html', context)


'''def sentimentResult(request):
    return render(request, 'base/home.html', {})'''


def loadHome(request):
    """
    reloads home
    :param request:
    :return: returns the load_home.html page
    """
    context = {}
    return render(request, 'base/load_home.html', context)


def groupChat(request):
    context = {}
    return render(request, 'base/group_chat.html', context)


def notifications(request):
    """
    A page that displays notifications to a user.
    :param request:
    :return: returns notifications.html and the accompanying data.
    """
    users = CustomUser.objects.all()
    forums = Forum.objects.all()

    notifications = Notification.objects.all()

    # lead = Leader.objects.get(leader_id=1)
    # follows = lead.followers.all()
    # print(follows)

    # getting all the leaders
    leaders = Leader.objects.all()
    following_leaders = [] # the id of the leaders a user is following
    for i in range(1, len(leaders)+1):
        list_ = []
        try:
            leader = Leader.objects.get(leader_id=i)
            list_ = leader.followers.all()
            print(list_)
        except:
            pass
        else:
            leader = Leader.objects.get(leader_id=i)
            list_ = leader.followers.all()
            print(list_)

        if request.user in list_:
            following_leaders.append(i)

    for i in range(0, len(following_leaders)):
        # Notification.objects.get(notifier_id=1)
        pass

    notifications = Notification.objects.filter(notifier_id__in = following_leaders)
    print(following_leaders)
    # print(lead)

    answers = Answer.objects.all()
    nf_messages = NFMessage.objects.all()
    questions = Question.objects.all()

    context = {'forums': forums,
               'notifications': notifications,
               'answers': answers,
               'nf_messages': nf_messages,
               'questions': questions,
               'users': users,
               }
    return render(request, 'base/notifications.html', context)


def readUnreadNotification(request):
    """
    gives the state of the number of unread messages
    :param request:
    :return: a JsonResponse of the number of unread notifications
    """
    global unread_notifications
    # display_parameter = 0
    print("unread_notifications = ", unread_notifications)
    return JsonResponse({'unread_notifications': unread_notifications})
    # 'display_parameter': display_parameter})


def updateUnreadNotifications(request):
    """
    updates the number of unread notifications
    :param request:
    :return: gives a Json response of the number of unread notifications
    """
    global unread_notifications
    is_ajax = request.META.get('HTTP_X_REQUESTED_WITH') == "XMLHttpRequest"
    if is_ajax:
        print(request.GET)
        unread_notifications = int(request.GET["unread_notifications"])
    print('unread =', unread_notifications)
    return JsonResponse({'unread_notifications': unread_notifications})


# START
# these are for tutorial purposes
# The notifications 1, 2 and 3 show three different ways of using JSONreponse
def notifications_update3(request):
    text = "I am a text"
    return JsonResponse({"text": text})

def notifications_update2(request, num_posts):
    visible = 3
    upper = num_posts  # upper, the number of posts to display in total, is 3 initially
    # but increases with each button click
    lower = upper - visible
    print('lower = %s, upper = %s , visible = %s' % (lower, upper, visible))

    messages = Post.objects.all()
    size = messages.count()
    print('number of messages', size)
    context = {}

    message = []
    for message_ in messages:
        item = {
            'id': message_.id,
            'message': message_.message,
            'title': message_.title,
            'liked': True if request.user in message_.liker.all() else False,
            'like_count': message_.like_count,
        }
        message.append(item)

    print(message)
    return JsonResponse({'messages': message[lower:upper], 'size': size})


def notifications_update(request):
    forums = Forum.objects.all()
    context = {}

    return JsonResponse({
        "forums": list(forums.values())
    })

    # return render(request, 'base/notifications.html', context)
# END


def like_unlike_post(request):
    """
    likes or unlikes a post.
    :param request:
    :return: a boolean in Json format, where true is like and false is unlike
    """
    is_ajax = request.META.get('HTTP_X_REQUESTED_WITH') == "XMLHttpRequest"
    if is_ajax:
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)
        if request.user in obj.liker.all():
            liked = False
            obj.liker.remove(request.user)
        else:
            liked = True
            obj.liker.add(request.user)

        return JsonResponse({'liked': liked, 'count': obj.like_count})


like = True


# to be removed
def to_be_deleted(request):
    # Here I show how to make a like button
    '''global like
    if request.method == "POST":
        if request.POST.get('like_id'):
            like = False
        else:
            like = True
    context = {'like': like}'''
    context = {}
    return render(request, 'base/to_be_deleted.html', context)


def create(request):
    """
    creates a new train (also called forum). This function is to be removed
    :param request:
    :return: returns
    """
    if request.method == "POST":
        name = request.POST['name']
        new_user = Forum(name=name, host=request.user)
        new_user.save()
        context = {}
        return render(request, 'base/notifications.html', context)


def registrationPage(request):
    """
    registers a new user
    :param request:
    :return: if registration is successful, returns a verification page and then home page.
    """
    page = 'registration'
    form = RegisterForm()
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()

            # ORIGINAL
            # To get the domain of the current site
            current_site = get_current_site(request)
            mail_subject = 'An activation link has been sent to you'
            message = render_to_string('base/acc_active_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
                'protocol': 'https' if request.is_secure else 'http'
            })

            to_email = form.cleaned_data.get('email')
            email = EmailMessage(
                mail_subject, message, to=[to_email]
            )
            email.send()

            ''' # To get the domain of the current site
            current_site = get_current_site(request)
            mail_subject = 'An activation link has been sent to you'
            message = render_to_string('base/acc_active_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
                'protocol': 'https' if request.is_secure else 'http'
            })

            to_email = form.cleaned_data.get('email')
            email = EmailMessage(
                mail_subject, message, to=[to_email]
            )
            if email.send():
                messages.success(request, 'succesfully done')
            else:
                messages.error(request, "could not send message")
            '''
            return redirect("verification")

        else:
            messages.error(request, 'something went wrong')

    context = {'login': True, 'page': page, 'form': form}
    return render(request, 'base/login_register.html', context)


def loginPage(request):
    """
    login page for registered users
    :param request:
    :return: home page of successful.
    """
    page = 'login'
    form = LoginForm()

    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        print(password)

        ''' form = LoginForm(request.POST)
        if form.is_valid():'''
        try:
            CustomUser.objects.filter(Q(username=username) | Q(email=username))
        except:
            messages.error(request, 'user does not exist')

        user = authenticate(request, username=username, password=password)
        # user = CustomUser.objects.get(Q(username=username) | Q(password=password))
        # user = 'come'
        print(user)
        if user is not None:
            login(request, user)
            # return redirect(reverse('home', args=(user,)))
            return redirect('home')

        else:
            messages.error(request, "user does not exist")
    else:
        messages.error(request, 'something went wrong')

    context = {'login': True, 'page': page, 'form': form}
    return render(request, 'base/login_register.html', context, )


def logoutPage(request):
    """
    Logs a registered user out of the train app.
    :param request:
    :return:
    """
    logout(request)
    return redirect('home')


def activate(request, uidb64, token):
    """
    activating the user account
    :param request:
    :param uidb64:
    :param token:
    :return: if successful, displays a page showing the user registration status
    """
    User = get_user_model()
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()

        context = {'registration': 'succeeded'}
        return render(request, 'base/reg_status.html', context)
    else:
        context = {'registration': 'failed'}
        return render(request, 'base/reg_status.html', context)


# for email confirmation
def verification(request):
    """
    displays the verification page
    :param request:
    :return: the verification page
    """
    context = {}
    return render(request, 'base/verification.html', context)


def joinForum(request):
    """
    displays a page where a registered user can join any forum (train) of his choice
    :param request:
    :return: the join_forum page
    """
    forums = Forum.objects.all()
    context = {'forums': forums}
    return render(request, 'base/join_forum.html', context)


def createForum(request):
    """
    displays a page where a registered user can create any forum (train) of his choice
    :param request:
    :return: if the train is successfully created, it returns the train page.
    """
    form = CreateForumForm()
    if request.method == 'POST':

        # user = get_user_model()

        forum = Forum(host=request.user)  # create the table first with a host
        form = CreateForumForm(request.POST, instance=forum)  # then fill this table with the remaining data
        if form.is_valid():
            form.save()
            forum = Forum.objects.latest('id')
            forum.participants.add(request.user)

            return redirect(reverse('forum', args=(forum.id,)))

    context = {'form': form}
    return render(request, 'base/create_forum.html', context)


# an auxilliary variable
forum_no = ""


def forum(request, pk):
    """
    displays the forum page.
    :param request:
    :param pk: primary key which corresponds to each forum (train).
    :return: the forum page.
    """
    forums = Forum.objects.all()

    forum = Forum.objects.get(id=pk)

    members = Member.objects.all()

    # leader = None
    comment_form = MessageCommentForm()

    if Leader.objects.filter(leader=request.user):
        leader = Leader.objects.get(leader=request.user)
    print(forum)

    leaders = Leader.objects.all()

    # Want to use both current_forum and available_posts
    global current_forum, available_posts
    current_forum = forum

    form = MessageForm()
    posts = Message.objects.filter(forum=forum)
    comments = MessageComment.objects.all()
    #print("here\n",comments)
    # post_like = posts.total_likes
    available_posts = posts

    # likes = Like.objects.filter(forum_id=pk, message_id=2, like_status=True).values()

    if request.method == 'POST':
        message = Message(author=request.user, forum=forum)
        message = MessageForm(request.POST, instance=message)
        if message.is_valid():
            message.save()
            posts = Message.objects.filter(forum=forum)  # A post is a message posted by a user
            '''if posts[len(posts)-1].author_id != request.user.id:
                posts = posts[len(posts-2)]
            else:
                posts = Message.objects.filter(forum=forum)
            '''
            print("printed_post\n", posts)

            '''# Anyone who posts at least one message is a participant
            forum_ = Forum.objects.get(id=pk)
            forum_.participants.add(request.user)

            post = Message.objects.get(id=request.POST["post_id"])
            post.likes.add(request.user)
'''

            created = True
            '''context = {'topic': topic, 'created': created}
            return render(request, 'base/forum.html', context)'''
            return redirect(reverse('forum', args=(forum.id,)))
        else:
            messages.error(request, 'something is wrong')

            return redirect('forum', args=(forum.id,))

    # While using ajax and setInterval in javascript, this code was used to differentiate between last
    # post by user and last post by others.
    '''if posts[0].author_id != request.user.id:
        posts = posts[1:posts.count()-1]
    else:
        posts = Message.objects.filter(forum=forum)

    print("user_id", request.user.id)
    print("author_id", posts[posts.count()-1].author_id)'''

    emc = EmploymentCredential.objects.all()
    host_posts = Message.objects.filter(author=request.user)
    # host_likes_total = host_posts.likes.all().count()

    # to obtain total number of likes for host
    likes = []
    for post in host_posts:
        no_of_like = post.likes.all().count()
        likes.append(no_of_like)

    host_likes_total = sum(likes)

    # to obtain total number of followers for host
    host_as_leader = None
    if Leader.objects.filter(leader=request.user):
        host_as_leader = Leader.objects.get(leader=request.user)
    print("host", host_as_leader)
    # to obtain total number of comments on host's messages.
    '''host_message_comments = MessageComment.objects.filter(author_id=request.user.id)
    comments_ = []
    for message_comment in host_message_comments:
        message_comment_ = message_comment.comment.comments_total()
        comments_.append(message_comment)'''


    #print(sum(comments_))
    #print("new here", comments)

    forum = Forum.objects.get(id=pk)

    # obtaining all needed message images
    images = MessageImage.objects.all()

    context = {
        'forum': forum,
        'form': form,
        'leaders': leaders,
        'posts': posts,
        'comments': comments,
        'comment_form': comment_form,
        'emc': emc,
        'host_posts': host_posts,
        'host_likes_total': host_likes_total,
        'host_as_leader': host_as_leader,  # give the number of followers a host of a forum has.
        'members': members,
        'images': images,
    }
    # return redirect('forum_topic')
    return render(request, 'base/forum.html', context)


# to display all the messages in real time
def displayLastMessageByOthers(request, user_id):
    """
    Displays the last message that was not authored by the current user.
    :param request:
    :param user_id:
    :return: a Json response of the message its comments.
    """
    is_ajax = request.META.get("HTTP_X_REQUESTED_WITH") == "XMLHttpRequest"
    if is_ajax:
        data = []
        if request.method == "POST":
            # message = Message.objects.exclude(author_id=user_id)
            # message = message[0] # Takes the last message (by arrangement) by others.
            message = Message.objects.latest('id')
            comments = MessageComment.objects.filter(message_id=message.id)

            print(message)
            # data = []
            #for message in messages:

            # message
            data = [{
                'body': message.body,
                'created': message.created,
                'author': str(message.author),
                'user': str(request.user),
                'time_posted': str(message.time_posted),
                'forum_id': message.forum_id,
                'post_id': message.id,
                'likes_total': message.likes_total(),
                'timesince': message.created
            }]

            data2 = []
            for comment in comments:
                item = {
                    'commenter': str(comment.commenter),
                    'comment': comment.comment
                }

                data2.append(item)

            # data.append(item)
        return JsonResponse({'message': data, 'comment': data2})


# To create a new message in a forum
def createNewMessage(request):
    """
    Creates a new message in any forum.
    :param request:
    :return: a Json reponse of the message and its accompanying properties.
    """
    is_ajax = request.META.get("HTTP_X_REQUESTED_WITH") == "XMLHttpRequest"
    form = MessageForm()
    global current_forum
    forum = current_forum

    print(is_ajax)

    if is_ajax:
        if request.method == "POST":
            post_to_save = Message(author=request.user, forum=forum)
            print("post_to_save =", post_to_save)

            image_files = request.FILES.getlist('images')
            print("img", request.POST)

            form = MessageForm(request.POST or None, request.FILES or None, instance=post_to_save)
            print("FORM IS THIS", request.FILES)
            if form.is_valid():
                new_message = form.save(commit=False)
                # new_message.likes.add(request.user)
                new_message.save()

                message = Message.objects.latest('id')
                if image_files:
                    for image in image_files:
                        print("image", image)
                        MessageImage.objects.create(message=message, image=image)

                # Anyone who posts at least one message is a participant
                message_ = Message.objects.latest('id')
                forum_ = Forum.objects.get(id=message_.forum_id)
                forum_.participants.add(request.user)
            else:
                return HttpResponse("bad error")
            print(request.POST)
            '''else:
                return messages.error(request, 'error')'''
        print(forum)

        # getting the last message posted and employment credential
        # of its author.

        message_ = Message.objects.latest('id')
        emc = EmploymentCredential.objects.filter(user_em_id=message_.author_id)
        message = [{}]
        author = [{}]
        if emc:
            emc = EmploymentCredential.objects.get(user_em_id=message_.author_id)

        message = [{
            'body': message_.body,
            'created': message_.created,
            'author': str(message_.author),
            'user': str(request.user),
            'timesince': str(message_.timesince()),
            'forum_id': message_.forum_id,
            'post_id': message_.id,
            'likes_total': message_.likes_total(),
        }]

        '''images_ = MessageImage.objects.get(message_id=message_.id)
        images =[{
            'image': images_.image.url
        }]'''
        images = "smd"
        author = [{
            'position': emc.position if emc and emc.position is not None else None,
            'company_organization': emc.company_organization if emc and emc.company_organization else None,
            'start_year': emc.start_year_()["year"] if emc and emc.start_year_()["year"] is not None else None,
            'end_year':  emc.end_year_()["year"] if emc and emc.end_year_() is not None else None
        }]

        return JsonResponse({'message': message, 'author_credential': author, 'images':images})
        # context = {}
    # return render(request, 'base/forum.html', context)


def editMessage(request, post_id):
    """
    Edits an existing message
    :param request:
    :param post_id: the primary key (id) of the post in the database
    :return: a Json response of the edited message.
    """
    is_ajax = request.META.get("HTTP_X_REQUESTED_WITH") == "XMLHttpRequest"

    if is_ajax:
        if "body" in request.GET:
            print("body" in request.GET)
            message = Message.objects.get(id=post_id)
            message.body = request.GET["body"]
            message.save()
            # print(request.GET["body"])

            return JsonResponse({"message": message.body})

        else:
            print("body" in request.GET)
            message_ = Message.objects.get(id=post_id)
            message = [{
                'body': message_.body,
                'created': message_.created,
                'author': str(message_.author),
                'user': str(request.user),
                'forum_id': message_.forum_id,
                'post_id': message_.id,
                'likes_total': message_.likes_total()
            }]
            return JsonResponse({'message': message})


def deleteMessage(request, pk):
    """
    Deletes an existing message
    :param request:
    :param pk: the primary key of the existing message in the database
    :return: an empy Json response
    """
    is_ajax = request.META.get("HTTP_X_REQUESTED_WITH") == "XMLHttpRequest"
    if is_ajax:
        message = Message.objects.get(id=pk)
        message.delete()

        return JsonResponse({})


def updateLike(request, post_id, forum_id, source):
    """
    Updates the like in a forum (train) or home
    :param request:
    :param post_id: the primary key of the post (message) in database
    :param forum_id: the primary key of the forum (train) in database
    :param source: where the request came from i.e source = {'home': 1, 'forum':2}
    :return:
    """

    '''global current_forum, available_posts, no_of_likes
    forum = current_forum'''
    print(request.user)
    print(request.POST.get("post_id"))
    print(forum_id)
    message = Message.objects.filter(id=post_id, forum_id=forum_id, likes=request.user)
    print(message)
    if request.method == 'POST':
        post = Message.objects.get(id=request.POST["post_id"])
        # post = get_object_or_404(Message, id=request.POST.get('post_id'))
        print(type(post))
        if not message:
            # like message if user is not a liker of the person's message
            post.likes.add(request.user)
            message_ = Message.objects.get(id=post_id)
            data = [{
                'body': message_.body,
                'created': message_.created,
                'author': str(message_.author),
                'user': str(request.user),
                # 'time_posted': str(message_.time_posted),
                'forum_id': message_.forum_id,
                'post_id': message_.id,
                'likes_total': message_.likes_total(),
                'like_state': True if request.user in post.likes.all() else False
            }]
            if source == "1":
                # return redirect(reverse('home'))

                return JsonResponse({"message": data})
            else:
                return redirect(reverse('forum', args=str(forum_id)))

        else:
            # unlike message if user is a liker of the person's message
            post.likes.remove(request.user)
            message_ = Message.objects.get(id=post_id)
            data = [{
                'body': message_.body,
                'created': message_.created,
                'author': str(message_.author),
                'user': str(request.user),
                # 'time_posted': str(message_.time_posted),
                'forum_id': message_.forum_id,
                'post_id': message_.id,
                'likes_total': message_.likes_total()
            }]
            if source == "1":
                # return redirect(reverse('home'))
                return JsonResponse({"message": data})
            else:
                return redirect(reverse('forum', args=str(forum_id)))


def updateAllUsersLikes(request):
    """
      Updates the like in a forum (train) or home
      :param request:
      :return: a Json response of the messages.
    """
    is_ajax = request.META.get("HTTP_X_REQUESTED_WITH") == "XMLHttpRequest"
    if is_ajax:
        messages = Message.objects.all()
        data = []
        for message in messages:
            item = {
              'body': message.body,
              'created': message.created,
              'author': str(message.author),
              'user': str(request.user),
              'time_posted': str(message.time_posted),
              'forum_id': message.forum_id,
              'post_id': message.id,
              'likes_total': message.likes_total()
            }
            data.append(item)
        return JsonResponse({"messages": data})


def updateFollowers(request, author_id, forum_id, source):
    """
    updates the followers in a forum or on the home page
    :param request:
    :param author_id:
    :param forum_id:
    :param source:
    :return: a Json response of the users who are leaders (and the number of followers they have).
    A leader is a user with at least one follower.
    """

    # checking whether leader exists
    leader_exists = Leader.objects.filter(leader_id=author_id, has_followers=True)
    if request.method == 'POST':
        # if the owner of the message has no follower, change his status to 'has_followers'
        # and add current user as a follower.
        if not leader_exists:
            leader_ = Leader(leader_id=author_id, has_followers=True)
            leader_.save()  # creates new leader

            # adding new follower to leader
            leader = Leader.objects.get(leader_id=author_id)
            leader.followers.add(request.user)
            if source == "1":
                # return redirect(reverse('home'))
                data = [{
                    'leader': str(leader.leader),
                    'followers_total': leader.followers_total()
                }]
                return JsonResponse({'leader': data})
            else:
                return redirect(reverse('forum', args=str(forum_id, )))

        # else, if he has followers, add current user as his follower if the currrent user
        # was not previously his follower; else remove him (the current) from being a follower.
        elif leader_exists:
            leader = Leader.objects.get(leader_id=author_id)
            # Message.objects.get(id=request.POST.get("post_id"))
            if not Leader.objects.filter(Q(leader_id=author_id) & Q(followers=request.user)):
                leader.followers.add(request.user)
                print("observed", leader.followers)
            else:
                leader.followers.remove(request.user)
        if source == "1":
            data = [{
                'leader': str(leader.leader),
                'followers_total': leader.followers_total(),
                'following': True if request.user in leader.followers.all() else False
            }]
            print("leader",  leader.followers.all())

            return JsonResponse({'leader': data})
            # return redirect(reverse('home'))
        else:
            return redirect(reverse('forum', args=str(forum_id, )))


def comments(request, post_id):
    """
    Displays comments.
    :param request:
    :param post_id: the primary key of the post (message) in the database
    :return: a Json response of the comments.
    """
    source = "1"
    is_ajax = request.META.get("HTTP_X_REQUESTED_WITH") == "XMLHttpRequest"
    if is_ajax:
        data = []
        print(request.POST)
        message_ = Message.objects.get(id=post_id)
        commented = message_.author
        print(commented)
        comment_ = MessageComment(commenter=request.user, commented=request.user, message_id=post_id)


        if request.method == "POST":
            comment = MessageCommentForm(request.POST, instance=comment_)
            # print(request.POST)
            if comment.is_valid():
                comment.save()

                if source == "1":
                    # return redirect(reverse("home"))
                    comment = MessageComment.objects.latest('id')
                    print("ABC", MessageComment.objects.latest('id')) ##
                    # data = [{"comment": str(comment)}]

                    data = [{
                        'comment': str(comment),
                        'author': str(request.user),
                        'post_id': post_id
                    }]
                    # data.append(item)
                    print(data)
                    return JsonResponse({"comment": data})


def questions(request):
    """
    Allows user to create questions at the home page.
    :param request:
    :return: returns the home page.
    """

    '''if request.method == "POST":
        question = request.POST["question"]
        Question.object.create(author=request.user, question=question)'''

    # Takes care of questions asked at the home page
    form = QuestionForm()
    if request.method == "POST":
        # Question.objects.create(author=request.user)
        question_instance = Question(author=request.user)
        form = QuestionForm(request.POST, instance=question_instance)
        if form.is_valid():
            form.save()

            # creating notification for questions
            question = Question.objects.latest('id')
            new_question_notice = Notification.objects.create(notifier=request.user, item_no=question.id,
                                                              item_type="question", notice=question.question)
            users = CustomUser.objects.all()
            for user in users:
                new_question_notice.notifyee.add(user)

            return redirect("home")

    questions = Question.objects.all()
    context = {'questions': questions}
    return render(request, "base/home.html", context)


# Takes care of answers given to a question
def answers(request, question_id):
    form = AnswerForm(request.POST or None, request.FILES or None)
    if request.method == "POST":
        images = request.FILES.getlist("images")
        if form.is_valid:
            print(request.POST)
            question = Question.objects.get(id=question_id)
            answer = Answer.objects.create(author=request.user, question_id=question_id,
                                           answer=request.POST['message'], questioner=question.author)

            for image in images:
                if image:
                    AnswerImage.objects.create(image=image, answer=answer)

            # creating notification for answers
            new_question_notice = Notification.objects.create(notifier=request.user, item_type="answer",
                                                              item_no=answer.id, notice=answer.answer)
            users = CustomUser.objects.all()
            for user in users:
                new_question_notice.notifyee.add(user)

            return redirect('answer_question')

    context = {'form': form, }
    return render(request, "base/answers.html", context)


def nonForumPosts(request):
    """
    Creates posts (messages) at the home page
    :param request:
    :return: returns the home page
    """
    context = {}
    return render(request, "base/home.html", context)


def blog_answer(request, person, item_type, item_no):
    """
    Creates answers to questions asked.
    :param request:
    :param person: the current logged-in user.
    :param item_type: the item type can be any of ['post', 'answer']
    :param item_no: the primary key of the item in the database.
    :return:
    """
    item = None
    items = None
    users = CustomUser.objects.all()
    if item_type == "answer":
        item = Answer.objects.get(id=item_no)
        items = Answer.objects.exclude(id=item_no)

    elif item_type == "post":
        item = NFMessage.objects.get(id=item_no)
        items = NFMessage.objects.exclude(id=item_no)

    else:
        # else item_type = "question"
        item = Question.objects.get(id=item_no)
        items = Question.objects.exclude(id=item_no)
    print(item_type)
    context = {'item': item, 'items': items, 'item_type': item_type, 'users': users}
    return render(request, "base/blog.html", context)
