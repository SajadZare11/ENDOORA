from rest_framework.views import APIView
from rest_framework.response import Response
from .services import ExerciseGenerationService

class ExerciseGenerateView(APIView):
    def post(self, request):
        return Response(ExerciseGenerationService().generate(request.data))
