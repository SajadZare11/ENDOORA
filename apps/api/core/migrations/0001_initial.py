from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="FeatureFlag",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("key", models.SlugField(max_length=120, unique=True)),
                ("enabled", models.BooleanField(default=False)),
                (
                    "rollout_percentage",
                    models.PositiveSmallIntegerField(
                        default=0,
                        validators=[
                            django.core.validators.MinValueValidator(0),
                            django.core.validators.MaxValueValidator(100),
                        ],
                    ),
                ),
                ("environments", models.JSONField(default=list)),
                ("owner", models.CharField(max_length=120)),
                ("rationale", models.TextField()),
                ("dependencies", models.JSONField(blank=True, default=list)),
                (
                    "kill_switch_behavior",
                    models.CharField(
                        choices=[
                            ("disable_feature", "Disable feature"),
                            ("reviewed_fallback", "Use reviewed fallback"),
                            ("read_only", "Read-only"),
                            ("retry_later", "Retry later"),
                        ],
                        default="disable_feature",
                        max_length=32,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ("key",)},
        ),
        migrations.CreateModel(
            name="SystemSetting",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("key", models.SlugField(max_length=120, unique=True)),
                (
                    "value_type",
                    models.CharField(
                        choices=[
                            ("string", "String"),
                            ("integer", "Integer"),
                            ("boolean", "Boolean"),
                            ("json", "JSON object/list"),
                        ],
                        max_length=16,
                    ),
                ),
                ("value", models.JSONField()),
                ("description", models.TextField(blank=True)),
                (
                    "environment_scope",
                    models.CharField(
                        choices=[
                            ("global", "All environments"),
                            ("development", "Development"),
                            ("test", "Test"),
                            ("staging", "Staging"),
                            ("production", "Production"),
                        ],
                        default="global",
                        max_length=16,
                    ),
                ),
                ("owner", models.CharField(max_length=120)),
                ("rationale", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ("key",)},
        ),
    ]
