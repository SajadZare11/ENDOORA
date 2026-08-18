from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import User


class EndooraUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("email", "phone", "role", "preferred_locale")


class EndooraUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = "__all__"
