from __future__ import annotations
import hashlib
from rest_framework.throttling import SimpleRateThrottle, ScopedRateThrottle

class RoleBasedThrottle(SimpleRateThrottle):
    scope = 'role_based'

    def allow_request(self, request, view):
        if not request.user.is_authenticated:
            self.rate = '30/minute'
        else:
            role = getattr(request.user, 'role', 'anonymous')
            rates = {
                'learner': '60/minute',
                'teacher': '100/minute',
                'editor': '200/minute',
                'support': '200/minute',
                'administrator': '500/minute',
            }
            self.rate = rates.get(role, '30/minute')
            
        self.num_requests, self.duration = self.parse_rate(self.rate)
        return super().allow_request(request, view)

    def get_cache_key(self, request, view):
        self.request = request
        if request.user.is_authenticated:
            ident = f"{request.user.pk}_{getattr(request.user, 'role', 'unknown')}"
        else:
            ident = self.get_ident(request)
        return self.cache_format % {'scope': self.scope, 'ident': ident}

class BurstProtectionThrottle(SimpleRateThrottle):
    scope = 'burst_protection'
    rate = '10/second'

    def get_cache_key(self, request, view):
        if request.user.is_authenticated:
            ident = str(request.user.pk)
        else:
            ident = self.get_ident(request)
        
        path_hash = hashlib.md5(request.path.encode('utf-8')).hexdigest()
        return self.cache_format % {'scope': self.scope, 'ident': f"{ident}_{path_hash}"}

class SensitiveEndpointThrottle(ScopedRateThrottle):
    scope = 'sensitive_endpoint'
