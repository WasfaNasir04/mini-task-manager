from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Team, Project, Task, Notification
from .serializers import TeamSerializer, ProjectSerializer, TaskSerializer, UserSerializer, NotificationSerializer
from .permissions import IsTeamAdmin, IsTeamMember, IsTeamAdminOnly, IsProjectAdmin, IsAssigneeOrTeamAdmin
from django.contrib.auth import get_user_model
from rest_framework.exceptions import PermissionDenied

User = get_user_model()

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsTeamAdminOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Team.objects.all()
        return Team.objects.filter(members=user)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        team = self.get_object()
        user_id = request.data.get('user_id')
        user = get_object_or_404(User, id=user_id)
        
        if request.user.role != 'ADMIN':
            return Response(
                {'error': 'Only admins can add members to teams'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        team.members.add(user)
        return Response({'status': 'member added'})

    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        team = self.get_object()
        user_id = request.data.get('user_id')
        user = get_object_or_404(User, id=user_id)
        
        if request.user.role != 'ADMIN':
            return Response(
                {'error': 'Only admins can remove members from teams'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        team.members.remove(user)
        return Response({'status': 'member removed'})

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsProjectAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Project.objects.all()
        return Project.objects.filter(team__members=user)

    def perform_create(self, serializer):
        if self.request.user.role != 'ADMIN':
            raise PermissionDenied('Only admins can create projects')
        team = serializer.validated_data['team']
        if not team.members.filter(id=self.request.user.id).exists():
            raise PermissionDenied('You can only create projects for teams you are a member of')
        serializer.save()

    @action(detail=True, methods=['post'])
    def assign_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        user = get_object_or_404(User, id=user_id)
        
        # Only admins can assign members to projects
        if request.user.role != 'ADMIN':
            return Response(
                {'error': 'Only admins can assign members to projects'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        project.assigned_members.add(user)
        return Response({'status': 'member assigned'})

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsTeamMember]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['deadline', 'priority']

    def get_queryset(self):
        queryset = Task.objects.filter(project__team__members=self.request.user)
        
        assignee = self.request.query_params.get('assignee', None)
        if assignee:
            queryset = queryset.filter(assignee__id=assignee)
            
        priority = self.request.query_params.get('priority', None)
        if priority:
            queryset = queryset.filter(priority=priority)
            
        due_date = self.request.query_params.get('due_date', None)
        if due_date:
            queryset = queryset.filter(deadline__date=due_date)
            
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset

    def perform_create(self, serializer):
        project = serializer.validated_data['project']
        assignee = serializer.validated_data['assignee']
        
        # Ensure assignee is a member of the project's team
        if not project.team.members.filter(id=assignee.id).exists():
            raise serializers.ValidationError(
                {'assignee': 'Assignee must be a member of the project team'}
            )
        
        task = serializer.save()
        # Create notification for task assignment
        Notification.objects.create(
            user=task.assignee,
            task=task,
            notification_type='TASK_ASSIGNED',
            message=f'You have been assigned to task: {task.title}'
        )

    @action(detail=True, methods=['patch'], permission_classes=[IsAssigneeOrTeamAdmin])
    def update_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['To Do', 'In Progress', 'Done']:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        old_status = task.status
        task.status = new_status
        task.save()
        
        # Create notification for status change
        Notification.objects.create(
            user=task.assignee,
            task=task,
            notification_type='STATUS_CHANGED',
            message=f'Task "{task.title}" status changed from {old_status} to {new_status}'
        )
        
        return Response(TaskSerializer(task).data)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsTeamMember]
    filter_backends = [filters.OrderingFilter]
    ordering = ['-created_at']

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})
