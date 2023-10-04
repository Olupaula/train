from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    Member,
    CustomUser,
    Forum,
    MessageComment,
    Leader,
    Post,
    Message,
    MessageImage,
    NFMessage,
    NFMessageImage,
    Question,
    Answer,
    AnswerImage,
    Notification

)
# Topic

admin.site.register(Member)
admin.site.register(CustomUser)  # admin.site.register(CustomUser, UserAdmin)
admin.site.register(Forum)

admin.site.register(Message)
admin.site.register(MessageImage)

admin.site.register(NFMessage)
admin.site.register(NFMessageImage)

# admin.site.register(Topic)
# admin.site.register(Like)

admin.site.register(MessageComment)
admin.site.register(Leader)

admin.site.register(Answer)
admin.site.register(AnswerImage)

admin.site.register(Question)

admin.site.register(Post)

admin.site.register(Notification)



