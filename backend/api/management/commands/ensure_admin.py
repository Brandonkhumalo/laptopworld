import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update a superuser from ADMIN_USERNAME / ADMIN_PASSWORD env vars."

    def handle(self, *args, **options):
        username = os.environ.get("ADMIN_USERNAME")
        password = os.environ.get("ADMIN_PASSWORD")
        email = os.environ.get("ADMIN_EMAIL", "")

        if not username or not password:
            self.stdout.write(
                "ensure_admin: ADMIN_USERNAME or ADMIN_PASSWORD not set, skipping."
            )
            return

        User = get_user_model()
        user = User.objects.filter(username=username).first()

        if user is None:
            User.objects.create_superuser(
                username=username, email=email, password=password
            )
            self.stdout.write(f"ensure_admin: superuser '{username}' created.")
            return

        if (
            user.is_staff
            and user.is_superuser
            and user.email == email
            and user.check_password(password)
        ):
            self.stdout.write(
                f"ensure_admin: superuser '{username}' already up to date, no changes."
            )
            return

        user.is_staff = True
        user.is_superuser = True
        user.email = email
        user.set_password(password)
        user.save()
        self.stdout.write(f"ensure_admin: superuser '{username}' updated.")
