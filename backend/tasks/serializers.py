from rest_framework import serializers
from .models import Team, Project, Task, Notification
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')
        read_only_fields = ('id', 'role')

class TeamSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'members']

class ProjectSerializer(serializers.ModelSerializer):
    team = TeamSerializer(read_only=True)
    team_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(),
        source='team',
        write_only=True
    )

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'team', 'team_id']

class TaskSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    assignee_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='assignee',
        write_only=True
    )
    project = ProjectSerializer(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        source='project',
        write_only=True
    )

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'deadline', 
            'assignee', 'assignee_id', 'priority', 'status',
            'project', 'project_id'
        ]
        read_only_fields = ['id']

    def validate_status(self, value):
        valid_statuses = ['To Do', 'In Progress', 'Done']
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Status must be one of: {', '.join(valid_statuses)}")
        return value

class NotificationSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'user', 'task', 'notification_type', 'message', 'created_at', 'is_read']
        read_only_fields = ['id', 'user', 'task', 'notification_type', 'message', 'created_at'] 