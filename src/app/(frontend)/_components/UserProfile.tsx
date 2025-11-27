/* eslint-disable @next/next/no-img-element */
'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export function UserProfile() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Sign In
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm font-medium">
          Welcome, {session.user.name || session.user.email}
        </span>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Sign Out
      </button>
    </div>
  )
}
