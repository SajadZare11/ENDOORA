from rest_framework import permissions
from rest_framework.generics import RetrieveAPIView

from .models import PlacementSession
from .serializers import PlacementSessionSerializer


class PlacementSessionView(RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PlacementSessionSerializer

    def get_queryset(self):
        return PlacementSession.objects.filter(user=self.request.user)
