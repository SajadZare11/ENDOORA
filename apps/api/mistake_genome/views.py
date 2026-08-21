from rest_framework.views import APIView
from rest_framework.response import Response
from .services import MistakeGenomeService

class MistakeGenomeView(APIView):
    def get(self, request):
        return Response(MistakeGenomeService().analyze(request.user.id))
