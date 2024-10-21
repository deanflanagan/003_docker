from django.test import TestCase

from .models import User

# Create your tests here.
class UserTests(TestCase):
    def test_user_login(self):
        user_data = {
            'username': 'test_user',
            'email': 'test_user@example.com',
            'password': 'test_password',
            'country': 'US',
            'phone': '555-5555',
        }
        user = User.objects.create_user(**user_data)

        response = self.client.post('/api/register', data=user_data)
        self.assertEqual(response.status_code, 200)
