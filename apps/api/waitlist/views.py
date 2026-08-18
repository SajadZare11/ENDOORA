from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .serializers import WaitlistSignupSerializer


class WaitlistSignupView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "waitlist"

    def post(self, request):
        serializer = WaitlistSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        created = serializer.context.get("created", False)
        return Response(
            {"status": "joined" if created else "already_joined"},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
