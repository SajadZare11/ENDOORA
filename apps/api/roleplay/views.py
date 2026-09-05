from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import RoleplaySession
from .serializers import RoleplayReportSerializer, RoleplaySessionSerializer
from .services import RoleplayService


class ScenarioListView(APIView):
    """
    Returns the curated catalog of roleplay scenarios.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        scenarios = RoleplayService.get_scenarios()
        return Response(scenarios, status=status.HTTP_200_OK)


class ScenarioDetailView(APIView):
    """
    Returns a single scenario specification by ID.
    """
    permission_classes = [AllowAny]

    def get(self, request, scenario_id):
        scenario = RoleplayService.get_scenario(scenario_id)
        if not scenario:
            return Response(
                {"error": f"Scenario '{scenario_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(scenario, status=status.HTTP_200_OK)


class SessionStartView(APIView):
    """
    Starts a new roleplay session or resumes an active one for the authenticated learner.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        scenario_id = request.data.get("scenario_id")
        if not scenario_id:
            return Response(
                {"error": "scenario_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            service = RoleplayService()
            session = service.start_or_resume_session(request.user, scenario_id)
            serializer = RoleplaySessionSerializer(session)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class SessionDetailView(APIView):
    """
    Retrieves full details of a roleplay session including dialogue history and report.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        try:
            session = RoleplaySession.objects.get(id=session_id, learner=request.user)
            serializer = RoleplaySessionSerializer(session)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except RoleplaySession.DoesNotExist:
            return Response(
                {"error": "Session not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )


class SessionMessageView(APIView):
    """
    Submits a learner message turn and retrieves the in-character response.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        message = request.data.get("message", "").strip()
        if not message:
            return Response(
                {"error": "Message content cannot be blank."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            service = RoleplayService()
            result = service.send_message(request.user, session_id, message)
            session = RoleplaySession.objects.get(id=session_id, learner=request.user)
            result["session"] = RoleplaySessionSerializer(session).data
            return Response(result, status=status.HTTP_200_OK)
        except RoleplaySession.DoesNotExist:
            return Response(
                {"error": "Session not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SessionHintView(APIView):
    """
    Retrieves pedagogical phrasing hint for the learner's current turn.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        try:
            service = RoleplayService()
            hint = service.get_hint(request.user, session_id)
            return Response(hint, status=status.HTTP_200_OK)
        except RoleplaySession.DoesNotExist:
            return Response(
                {"error": "Session not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )


class SessionCompleteView(APIView):
    """
    Manually finishes an active roleplay session and generates the post-conversation report.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        try:
            session = RoleplaySession.objects.get(id=session_id, learner=request.user)
            session.status = "completed"
            session.save(update_fields=["status", "updated_at"])

            service = RoleplayService()
            report = service.create_report(session)
            serializer = RoleplaySessionSerializer(session)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except RoleplaySession.DoesNotExist:
            return Response(
                {"error": "Session not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )


class AcceptMistakeView(APIView):
    """
    Accepts a deferred mistake from the report and synchronizes it with the Mistake Genome.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        mistake_id = request.data.get("mistake_id")
        if not mistake_id:
            return Response(
                {"error": "mistake_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            service = RoleplayService()
            report = service.accept_mistake(request.user, session_id, mistake_id)
            serializer = RoleplayReportSerializer(report)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except RoleplaySession.DoesNotExist:
            return Response(
                {"error": "Session not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class SaveSrsWordView(APIView):
    """
    Saves an extracted target vocabulary word from the report into the learner's SRS deck.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        lemma = request.data.get("lemma")
        if not lemma:
            return Response(
                {"error": "lemma is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            service = RoleplayService()
            report = service.save_srs_word(request.user, session_id, lemma)
            serializer = RoleplayReportSerializer(report)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except RoleplaySession.DoesNotExist:
            return Response(
                {"error": "Session not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
