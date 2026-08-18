# Generated for Endoora Day 06 on 2026-08-18.
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="WaitlistSignup",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("locale", models.CharField(choices=[("fa", "Persian"), ("en", "English")], default="fa", max_length=2)),
                ("source", models.CharField(default="direct", max_length=64)),
                ("landing_path", models.CharField(blank=True, max_length=255)),
                ("consent_version", models.CharField(max_length=32)),
                ("consented_at", models.DateTimeField(auto_now_add=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "verbose_name": "waitlist signup",
                "verbose_name_plural": "waitlist signups",
                "ordering": ("-created_at",),
            },
        ),
    ]
