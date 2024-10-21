from django.db import models
from django.contrib.auth.models import AbstractUser

class Token(models.Model):
    id = models.AutoField(primary_key=True)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    expires_at = models.DateTimeField()
    user_id = models.IntegerField()
    is_used = models.BooleanField(default=False)

class User(AbstractUser):
    phone = models.CharField(max_length=10, null=True)
    country = models.CharField(max_length=63)
    has_submitted = models.BooleanField(default=False)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='api_user_set',  # Add related_name to avoid clashes
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='api_user_set',  # Add related_name to avoid clashes
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self) -> str:
        return self.username

    class Meta:
        permissions = [
            ('can_view_report', 'Can view report'),
        ]


class Question(models.Model):
    id = models.AutoField(primary_key=True)
    text = models.TextField()
    correct_answer = models.IntegerField()

    def __str__(self) -> str:
        return f'Question {self.id}: {self.text}'

class Answer(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    answer = models.IntegerField()
    is_correct = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f'Answer {self.id} by {self.user.username} for Question {self.question.id}'
    
    def save(self, *args, **kwargs):
        self.is_correct = self.question.correct_answer == self.answer
        super().save(*args, **kwargs)