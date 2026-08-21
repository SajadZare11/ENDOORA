from django.db import migrations, models
import django.db.models.deletion
import uuid
from django.conf import settings

class Migration(migrations.Migration):
    initial=True
    dependencies=[("accounts","0001_initial")]
    operations=[
        migrations.CreateModel(
            name="DailyMission",
            fields=[
                ("id",models.UUIDField(default=uuid.uuid4,editable=False,primary_key=True,serialize=False)),
                ("mission_date",models.DateField()),
                ("title_fa",models.CharField(max_length=200)),
                ("title_en",models.CharField(max_length=200)),
                ("explanation_fa",models.TextField()),
                ("explanation_en",models.TextField()),
                ("evidence_reason",models.JSONField(default=dict)),
                ("status",models.CharField(default="ready",max_length=20)),
                ("created_at",models.DateTimeField(auto_now_add=True)),
                ("user",models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,related_name="daily_missions",to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering":("-mission_date",),"unique_together":{("user","mission_date")}},
        )
    ]
