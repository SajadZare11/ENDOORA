from rest_framework.views import APIView
from rest_framework.response import Response
class RoleplayView(APIView):
    def post(self,request): return Response({'reply':'Roleplay foundation'})
