from rest_framework.response import Response
from rest_framework.views import APIView

from .path import build_learning_path
from .serializers import LearningPathSerializer


class LearningPathView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "authentication_required"}, status=401)

        serializer = LearningPathSerializer(data=build_learning_path(request.user))
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
