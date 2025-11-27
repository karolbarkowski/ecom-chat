import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { SignInButton } from './_components/SignInButton'

const errorMessages: Record<string, string> = {
  OAuthAccountNotLinked:
    'This email is already associated with another account. Please sign in with your original method.',
  OAuthSignin: 'Error connecting to the authentication provider. Please try again.',
  OAuthCallback: 'Error processing authentication. Please try again.',
  Default: 'An error occurred during sign in. Please try again.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await auth()
  const params = await searchParams

  // If user is already logged in, redirect to home
  if (session?.user) {
    redirect('/')
  }

  const error = params.error
  const errorMessage = error ? errorMessages[error] || errorMessages.Default : null

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-8">Sign in to your account</p>

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        <div className="space-y-4">
          <SignInButton provider="google" />
          <SignInButton provider="facebook" />
        </div>
      </div>
    </div>
  )
}
