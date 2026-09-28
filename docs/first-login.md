# First login (admin accounts)

Visitors can never register. Accounts are made by an admin, inside the admin, under Users.

The very first admin cannot be made that way (nobody can sign in yet). A developer creates it once, directly in the database. After that:

1. Sign in at `/admin/login`.
2. Users → New. Name, email, password (12+ characters), role.
3. Give Admin to two people, no more. Everyone else gets Member.

Forgot password: use the reset link on the login page. It arrives by email (so Resend must work). To switch someone off, untick Active instead of deleting. Never change your own role.
