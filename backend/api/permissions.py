# permissions.py
from rest_framework import permissions

class CanViewReportPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm('can_view_report')