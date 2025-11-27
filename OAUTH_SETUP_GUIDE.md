# OAuth Authentication Setup Guide

## OAuth Provider Setup

### 1. Generate AUTH_SECRET

First, generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Copy the output and update `.env`:
```
AUTH_SECRET=<your-generated-secret>
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://yourdomain.com/api/auth/callback/google`
5. Copy the Client ID and Client Secret
6. Update `.env`:
   ```
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret
   ```

### 3. Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one:
   - Click "My Apps" > "Create App"
   - Choose "Consumer" as app type
   - Fill in the app details
3. Set up Facebook Login:
   - In your app dashboard, add "Facebook Login" product
   - Go to "Facebook Login" > "Settings"
   - Add Valid OAuth Redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/facebook`
     - Production: `https://yourdomain.com/api/auth/callback/facebook`
4. Get your credentials:
   - Go to "Settings" > "Basic"
   - Copy the App ID and App Secret
5. Update `.env`:
   ```
   AUTH_FACEBOOK_ID=your-facebook-app-id
   AUTH_FACEBOOK_SECRET=your-facebook-app-secret
   ```

## Using the Authentication

### In Server Components

```tsx
import { auth } from '@/auth'

export default async function Page() {
  const session = await auth()

  if (!session?.user) {
    return <p>Not logged in</p>
  }

  return <p>Welcome {session.user.name}!</p>
}
```

### In Client Components

```tsx
'use client'

import { useSession } from 'next-auth/react'

export function Component() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>
  if (!session) return <p>Not logged in</p>

  return <p>Welcome {session.user.name}!</p>
}
```

### Sign Out

```tsx
'use client'

import { signOut } from 'next-auth/react'

export function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/' })}>
      Sign Out
    </button>
  )
}
```

## Database Collections

NextAuth with MongoDB adapter will automatically create these collections:
- `users` - User accounts
- `accounts` - OAuth account connections
- `sessions` - User sessions
- `verification_tokens` - Email verification tokens

## Testing

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Click either "Continue with Google" or "Continue with Facebook"

4. Complete the OAuth flow

5. You should be redirected back to your app and logged in

## Production Deployment

Before deploying to production:

1. Update redirect URIs in Google and Facebook consoles
2. Set all environment variables in your hosting platform
3. Ensure your database is accessible from production
4. Test the OAuth flow on your production domain

## Troubleshooting

### "Redirect URI mismatch" error
- Verify the redirect URI in your OAuth provider console matches exactly
- Make sure to include `/api/auth/callback/[provider]` in the path

### "Invalid client" error
- Double-check your Client ID and Client Secret
- Ensure there are no extra spaces in your `.env` file

### Session not persisting
- Check MongoDB connection string
- Verify DATABASE_URI is correct in `.env`
- Check that MongoDB adapter is properly configured

## Security Notes

- Never commit `.env` file to version control
- Keep your Client Secrets secure
- Use HTTPS in production
- Regularly rotate your AUTH_SECRET
- Review OAuth scopes requested by your app

## Additional Features

You can extend this setup with:
- Email/password authentication
- Additional OAuth providers (GitHub, Twitter, etc.)
- Role-based access control
- Custom sign-in pages
- Session timeout configuration
- Multi-factor authentication

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
