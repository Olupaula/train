from django.http import JsonResponse
from django.shortcuts import render, redirect, reverse
from django.contrib import messages
from django.contrib.auth import get_user_model
from .models import (
    Profile,
    EmploymentCredential,
    EducationCredential,
    LocationCredential,
)

from chat.models import (
    Answer,
    Question,
    NFMessage,
    Leader,
    Forum,
    Message,
    CustomUser
)

from .forms import (
    ProfileForm,
    EmploymentCredentialForm,
    EducationCredentialForm,
    LocationCredentialForm,
    CustomUserForm,
)

from django.db.models import Q

# ec is employment credential to be used to get the current employment credential
# ed is educational credential to be used to get the current educational credential



def profile(request):

    forums = Forum.objects.filter(Q(host=request.user) | Q(participants=request.user))
    posts = Message.objects.all()
    user_posts = Message.objects.filter(author_id=request.user.id).values()
    #print(user_posts)

    # To determine whether to display update or add credentials of the types below

    emc = EmploymentCredential.objects.filter(user_em=request.user)
    edc = EducationCredential.objects.filter(user_ed=request.user)
    loc = LocationCredential.objects.filter(user_lo=request.user)
    if emc:
        emc = EmploymentCredential.objects.get(user_em=request.user)
    if edc:
        edc = EducationCredential.objects.get(user_ed=request.user)
    if loc:
        loc = LocationCredential.objects.get(user_lo=request.user)

    # to obtain  the total number of forums in which a person is
    user_belongs_to_forums = None
    user_number_of_forums = None
    forums_hosted_by_user = None

    no_of_followers = 0  # number of followers the user has
    no_of_followings = 0 # number of people the user is following

    # obtaining the number of followers the user has
    leader_exist = Leader.objects.filter(leader=request.user)
    leader = None
    if leader_exist:
        leader = Leader.objects.get(leader=request.user)
        followers = leader.followers.all()
        data = []
        for follower in followers:
            no_of_followers += 1
            print("no_of_followers =", no_of_followers)

    # obtaining the number of people the user is following
    leaders = Leader.objects.all()
    for leader in leaders:
        for request.user in leader.followers.all():
            no_of_followings += 1
            print("no_of_followings", no_of_followings)

    if Forum.objects.filter(participants=request.user):
        user_belongs_to_forums = Forum.objects.filter(participants=request.user)
        user_number_of_forums = user_belongs_to_forums.count()

        # forums hosted by current user:
        forums_hosted_by_user = Forum.objects.filter(host=request.user)

    print(request.user)

    # print(ec)
    context = {
        'forums': forums,
        'posts': posts,
        'user_posts': user_posts,
        'emc': emc,
        'edc': edc,
        'loc': loc,
        'user_number_of_forums': user_number_of_forums,
        'forums_hosted_by_user': forums_hosted_by_user,
        'followers_total': no_of_followers,
        'followings_total': no_of_followings,
    }
    return render(request, 'user_profile/profile.html', context)


def edit_profile(request, user_id):
    # user = CustomUser(username=request.user, email=request.user.email)
    form = CustomUserForm(instance=request.user)
    if request.method == "POST":

        form = CustomUserForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect("profile")
        else:
            messages.error(request, 'error')

    context = {'form': form}
    return render(request, 'user_profile/edit_profile.html', context)


# Employment Credentials upload and update
def employmentCredential(request):
    form = EmploymentCredentialForm()
    # Creating a new employment credential
    if request.method == "POST":
        ec = EmploymentCredential(user_em=request.user)  # ec means employment credential
        form = EmploymentCredentialForm(request.POST, instance=ec)

        if form.is_valid():
            form.save()
            return redirect("profile")
        else:
            messages.error(request, 'something is wrong')

    context = {'form': form}
    return render(request, 'user_profile/employment_credential.html', context)


def updateEmploymentCredential(request):
    if request.method == "POST":
        emc = EmploymentCredential.objects.get(user_em=request.user)
        form = EmploymentCredentialForm(request.POST, instance=emc)

        if form.is_valid():
            form.save()
            return redirect("profile")

    emc = EmploymentCredential.objects.get(user_em=request.user)
    emc_form = EmploymentCredentialForm(instance=emc)

    context = {'emc': emc, 'emc_form': emc_form}
    return render(request, 'user_profile/update_employment_credential.html', context)


def deleteEmploymentCredential(request):
    if request.method == "POST":
        emc = EmploymentCredential.objects.get(user_em=request.user)
        emc.delete()
        return redirect("profile")
    context = {}
    return render(request, "user_profile/delete_employment_credential.html", context)


def educationCredential(request):
    form = EducationCredentialForm()
    # ec means educational qualification
    if request.method == "POST":
        ed = EducationCredential(user_ed=request.user)
        form = EducationCredentialForm(request.POST, instance=ed)

        if form.is_valid():
            form.save()
            return redirect("profile")
        else:
            messages.error(request, 'something is wrong')

    context = {'form': form}
    return render(request, 'user_profile/education_credential.html', context)


def deleteEducationCredential(request):
    if request.method == "POST":
        edc = EducationCredential.objects.get(user_ed=request.user)
        edc.delete()
        return redirect("profile")
    context = {}
    return render(request, 'user_profile/profile.html', context)


def updateEducationCredential(request):
    edc = EducationCredential.objects.get(user_ed=request.user)
    form = EducationCredentialForm(instance=edc)

    if request.method == "POST":
        form = EducationCredentialForm(request.POST, instance=edc)
        if form.is_valid():
            form.save()
            return redirect("profile")
        else:
            messages.error(request, 'something is wrong')

    context = {'form': form, 'edc': edc}
    return render(request, 'user_profile/update_education_credential.html', context)


def locationCredential(request):
    form = LocationCredentialForm()
    loc_exists = LocationCredential.objects.filter(user_lo=request.user)
    if not loc_exists:
        if request.method == "POST":
            loc = LocationCredential(user_lo=request.user)
            form = LocationCredentialForm(request.POST, instance=loc)
            if form.is_valid():
                form.save()
                return redirect("profile")
        else:
            messages.error(request, "something went wrong")

    context = {'form': form}
    return render(request, 'user_profile/location_credential.html', context)


def updateLocationCredential(request):
    loc = LocationCredential.objects.get(user_lo=request.user)
    form = LocationCredentialForm(instance=loc)

    if request.method == "POST":
        form = LocationCredentialForm(request.POST, instance=loc)
        if form.is_valid():
            form.save()
            return redirect("profile")
    else:
        messages.error(request, "something is wrong")

    context = {'form': form}
    return render(request, 'user_profile/update_location_credential.html', context)


def deleteLocationCredential(request):
    if request.method == "POST":
        loc = LocationCredential.objects.get(user_lo=request.user)
        loc.delete()
        return redirect(profile)

    context = {}
    return render(request, 'user_profile/profile', context)


# Takes care of listing questions that can be answered.
def answerQuestions(request):
    questions = Question.objects.all()
    # Here, the answer dict takes each question (by id) and finds the total number of
    # answers. i.e. filter the answers for each question (identified by question_id)
    # and count the number of answers belonging to each of the questions
    answer = dict()
    for i in range(1, len(questions)+1):
        answer[i] = Answer.objects.filter(question_id=i).count()

    # print(answer)
    context = {'questions': questions,
               'answers': answer,
    }
    return render(request, 'base/answers.html', context)


# Takes care of questions by user
def userQuestions(request):
    questions = Question.objects.filter(author=request.user)

    questions_ = []
    for question in questions:
        item = {
            'author': str(question.author),
            'question': question.question
        }
        questions_.append(item)
        print(questions_)
    # return render(request, "base/home.html")
    return JsonResponse({"questions": questions_})


# Takes care of questions by user
def answersToUser(request):
    answers = Answer.objects.filter(questioner=request.user)

    answers_ = []
    for answer in answers:
        item = {
            'questioner': str(answer.questioner),
            'answer': answer.answer,
            'question': str(answer.question),
        }
        answers_.append(item)
        print(answers_)
    # return render(request, "base/home.html")
    return JsonResponse({"answers": answers_})


def postsByUser(request):
    messages = NFMessage.objects.filter(author=request.user)

    message_ = []
    for message in messages:
        item = {
            'author': str(message.author),
            'body': message.message,
            'created': message.timesince(),
        }
        message_.append(item)

    print(messages)
    # return render(request, "base/home.html")
    return JsonResponse({"messages": message_})


def followersOfUser(request):
    leader_exist = Leader.objects.filter(leader=request.user)
    leader = None
    followers_ = []
    if leader_exist:
        leader = Leader.objects.get(leader=request.user)

        for follower in leader.followers.all():
            item = {
                'name': str(follower),
                'id': follower.id,
            }
            followers_.append(item)

        print("followers", followers_)

    emc = EmploymentCredential.objects.all()
    # emc = EmploymentCredential.objects.filter(user_em=request.user)
    print(list(emc.values()))
    # return render(request, "base/home.html")
    return JsonResponse({"followers": followers_, "emc": list(emc.values())})


def followingsOfUser(request):
    followings_ = []

    leaders = Leader.objects.all()

    for leader in leaders:
        if request.user in leader.followers.all():
            item = {
                'name': str(leader.leader),
                'id': leader.id,
            }
            followings_.append(item)

        print("followings", followings_)

    emc = EmploymentCredential.objects.all()
    # emc = EmploymentCredential.objects.filter(user_em=request.user)
    print(list(emc.values()))
    # return render(request, "base/home.html")
    return JsonResponse({"followings": followings_, "emc": list(emc.values())})


'''
def usersFollowers(request):
    leader = Leader.objects.get(leader=request.user)
    followers = leader.followers.all()
    data = []
    
    i = 0
    for follower in followers:
        i = i+1
        print("i=", i)
    
    return JsonResponse({"followers_total": i}) '''
