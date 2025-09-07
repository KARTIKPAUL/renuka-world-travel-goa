// src/lib/auth.js
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth/next'


// Get session on server side
export async function getAuthSession() {
  return await getServerSession(authOptions)
}

// Check if user is authenticated
export async function requireAuth() {
  const session = await getAuthSession()
  if (!session) {
    throw new Error('Authentication required')
  }
  return session
}

// Check if user has specific role
export async function requireRole(allowedRoles) {
  const session = await requireAuth()
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error('Insufficient permissions')
  }
  return session
}

// Check if user profile is complete
export async function requireCompleteProfile() {
  const session = await requireAuth()
  if (!session.user.isProfileComplete) {
    throw new Error('Profile completion required')
  }
  return session
}