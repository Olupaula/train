from django.contrib.admin.widgets import AdminDateWidget
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import get_user_model
from django import forms
from django.forms import DateInput
from django.forms import MultiWidget

from .models import (
    Forum,
    Message,
    MessageImage,
    MessageComment,
    Question,
    NFMessage,
    Answer
)
# Topic


class RegisterForm(UserCreationForm):
    class Meta:
        model = get_user_model()
        fields = ["email", 'username', 'password1', 'password2']


class LoginForm(AuthenticationForm):
    username = forms.CharField(label='Email or Username')


class CreateForumForm(forms.ModelForm):
    class Meta:
        model = Forum
        exclude = ["host", 'participants']


'''class MessageForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["body"].widget.attrs.update({
            'placeholder': "What's on your mind",
            'rows': "2",
            'cols': "60",
            'id': "message_box"
        })

    class Meta:
        model = Message
        fields = ["body"]
'''


class MessageWithoutImageForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["body"].widget.attrs.update({
            'placeholder': "What's on your mind",
            'rows': "2",
            'cols': "60",
            'id': "message_box"
        })

    class Meta:
        model = Message
        fields = ["body"]


# The complete form
class MessageForm(MessageWithoutImageForm):
    images = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))
    images.required = False

    class Meta(MessageWithoutImageForm.Meta):
        fields = MessageWithoutImageForm.Meta.fields + ["images", ]

'''
class TopicForm(forms.ModelForm):
    class Meta:
        model = Topic
        fields = '__all__'
'''


class MessageCommentForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["comment"].widget.attrs.update({id: "df"})

    class Meta:
        model = MessageComment
        fields = ['comment']


class QuestionForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ['question']


class NFMessageFormWithoutImage(forms.ModelForm):
    class Meta:
        model = NFMessage
        fields = ['message']


class NFMessageForm(NFMessageFormWithoutImage):
    image = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))
    image.required = False

    class Meta(NFMessageFormWithoutImage.Meta):
        fields = NFMessageFormWithoutImage.Meta.fields + ["image", ]


class AnswerFormWithoutImage(forms.ModelForm):
    class Meta:
        model = Answer
        fields = ["answer"]


class AnswerForm(AnswerFormWithoutImage):
    image = forms.ImageField(widget=forms.ClearableFileInput(attrs={'multiple': True}))
    image.required = False

    class Meta(AnswerFormWithoutImage.Meta):
        fields = AnswerFormWithoutImage.Meta.fields + ["image", ]

