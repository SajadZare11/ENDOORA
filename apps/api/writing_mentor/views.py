from rest_framework.views import APIView
from rest_framework.response import Response
from .services import WritingMentorService

class WritingMentorView(APIView):
    def post(self, request):
        return Response(WritingMentorService().review(request.data.get('text','')))
