from rest_framework import permissions

class IsTeamAdmin(permissions.BasePermission):
    """
    Custom permission to only allow team admins to perform certain actions.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'ADMIN'

    def has_object_permission(self, request, view, obj):
        return request.user and request.user.role == 'ADMIN'

class IsTeamMember(permissions.BasePermission):
    """
    Custom permission to allow team members to view and interact with their teams.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role in ['ADMIN', 'MEMBER']

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'team'):
            return request.user in obj.team.members.all()
        elif hasattr(obj, 'members'):
            return request.user in obj.members.all()
        return False

class IsTeamAdminOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to create and manage teams.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.role == 'ADMIN'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return request.user in obj.members.all()
        return request.user and request.user.role == 'ADMIN'

class IsProjectAdmin(permissions.BasePermission):
    """
    Custom permission to only allow team admins to manage projects.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.role == 'ADMIN'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return request.user in obj.team.members.all()
        return request.user and request.user.role == 'ADMIN'

class IsAssigneeOrTeamAdmin(permissions.BasePermission):
    """
    Custom permission to only allow task assignees or team admins to modify tasks.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'ADMIN':
            return True
        return obj.assignee == request.user and request.user in obj.project.team.members.all() 