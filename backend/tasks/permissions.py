from rest_framework import permissions

class IsTeamAdmin(permissions.BasePermission):
    """
    Custom permission to only allow team admins to perform certain actions.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'ADMIN'

class IsTeamMember(permissions.BasePermission):
    """
    Custom permission to only allow team members to perform certain actions.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role in ['ADMIN', 'MEMBER']

class IsTeamAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow team admins to edit but allow members to view.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.role == 'ADMIN'

class IsAssigneeOrTeamAdmin(permissions.BasePermission):
    """
    Custom permission to only allow task assignees or team admins to modify tasks.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'ADMIN':
            return True
        return obj.assignee == request.user 