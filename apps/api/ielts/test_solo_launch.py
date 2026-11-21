from unittest.mock import Mock, patch
from django.test import SimpleTestCase, override_settings
from rest_framework.exceptions import ValidationError
from disaster_recovery.demo import SimulationDisabled
from disaster_recovery.services.backup_service import create_database_backup
from marketplace.services import initiate_checkout
from search.local_rank import ranked_page


class LaunchBoundaries(SimpleTestCase):
    @override_settings(ENDOORA_DEMO_OPERATIONS=False)
    def test_backup_simulation_disabled_before_any_database_call(self):
        with self.assertRaises(SimulationDisabled):
            create_database_backup()

    @override_settings(ZARINPAL_SANDBOX=False)
    def test_server_disallows_sandbox_checkout_before_creating_an_order(self):
        user = Mock(is_authenticated=True)
        with self.assertRaises(ValidationError):
            initiate_checkout(user, "subscription_plan", gateway_provider="sandbox")

    @override_settings(ENDOORA_SEARCH_MODEL_DIR="/local/example")
    @patch("search.local_rank.load_model", return_value=None)
    def test_search_remains_available_without_local_model(self, load):
        self.assertEqual(ranked_page(["first","second","third"], "example", 1, 3), ["second","third"])
