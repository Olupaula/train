# Generated by Django 4.0.4 on 2023-10-03 14:52

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_remove_answer_created'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='created',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
