# Generated by Django 4.0.4 on 2023-10-04 16:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_alter_notification_notifier'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='notifier',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifier', to=settings.AUTH_USER_MODEL),
        ),
    ]