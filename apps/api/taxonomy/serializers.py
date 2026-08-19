from rest_framework import serializers

from .models import TaxonomyNode


class TaxonomyNodeSerializer(serializers.ModelSerializer):
    display_label = serializers.SerializerMethodField()
    display_description = serializers.SerializerMethodField()
    parent = serializers.SerializerMethodField()
    replacement = serializers.SerializerMethodField()
    prerequisites = serializers.SerializerMethodField()

    class Meta:
        model = TaxonomyNode
        fields = (
            "id",
            "slug",
            "kind",
            "label_fa",
            "label_en",
            "display_label",
            "description_fa",
            "description_en",
            "display_description",
            "cefr_level",
            "descriptor_reference",
            "source_name",
            "source_url",
            "license_note",
            "estimated_effort_minutes",
            "status",
            "parent",
            "replacement",
            "prerequisites",
            "sort_order",
            "current_release",
        )

    def _lang(self) -> str:
        return self.context.get("lang", "fa")

    def get_display_label(self, obj: TaxonomyNode) -> str:
        return obj.label_en if self._lang() == "en" else obj.label_fa

    def get_display_description(self, obj: TaxonomyNode) -> str:
        return obj.description_en if self._lang() == "en" else obj.description_fa

    def get_parent(self, obj: TaxonomyNode):
        if obj.parent_id is None:
            return None
        return {
            "id": str(obj.parent_id),
            "slug": obj.parent.slug,
            "label_fa": obj.parent.label_fa,
            "label_en": obj.parent.label_en,
        }

    def get_replacement(self, obj: TaxonomyNode):
        if obj.replacement_id is None:
            return None
        return {
            "id": str(obj.replacement_id),
            "slug": obj.replacement.slug,
            "label_fa": obj.replacement.label_fa,
            "label_en": obj.replacement.label_en,
        }

    def get_prerequisites(self, obj: TaxonomyNode):
        links = [
            link
            for link in obj.prerequisite_links.all()
            if link.retired_in_id is None
        ]
        return [
            {
                "id": str(link.prerequisite_id),
                "slug": link.prerequisite.slug,
                "label_fa": link.prerequisite.label_fa,
                "label_en": link.prerequisite.label_en,
            }
            for link in links
        ]
