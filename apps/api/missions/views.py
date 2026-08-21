from rest_framework.response import Response
from rest_framework.views import APIView
from .services import build_daily_mission
from .serializers import DailyMissionSerializer

class TodayMissionView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"code":"authentication_required"}, status=401)
        mission=build_daily_mission(request.user)
        return Response(DailyMissionSerializer(mission).data)
