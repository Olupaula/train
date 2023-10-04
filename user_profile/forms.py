from django import forms
from .models import (
    EmploymentCredential,
    EducationCredential,
    LocationCredential,
    Profile
)

from chat.models import (
    CustomUser
)


class DateInput(forms.DateInput):
    input_type = 'date'


class EmploymentCredentialForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['end_year'].widget.attrs.update({'class': 'dend_year',})
        self.fields['currently_work_here'].widget.attrs.update({
            'id': 'tick',
            'value': 'false',
            'checked': False,
            'onclick': 'removeEndYear("tick", "End years", "id_end_year", "empCredForm", "8")'})

    class Meta:
        model = EmploymentCredential
        exclude = ['user_em']
        widgets = {
            'start_year': DateInput(),
            'end_year': DateInput(),
        }


class EducationCredentialForm(forms.ModelForm):
    class Meta:
        model = EducationCredential
        exclude = ['user_ed']


class LocationCredentialForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['end_year'].widget.attrs.update({
            'id': "id_end_year2"
        })
        self.fields["currently_live_here"].widget.attrs.update({
            'id': 'tick2',
            'value': 'false',
            'checked': False,
            'onclick': 'removeEndYear("tick2", "End year ", "id_end_year2", "loCredForm", "5")'
        })

    class Meta:
        model = LocationCredential
        exclude = ['user_lo']
        widgets = {
            'start_year': DateInput(),
            'end_year': DateInput(),
        }


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        exclude = ["user_pr"]


class CustomUserForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'bio', 'avatar', 'email', 'first_name', 'last_name']
