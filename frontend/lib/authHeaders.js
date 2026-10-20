import { auth } from '@/lib/firebase';

/**
 * Returns the Authorization header with the current user's Firebase ID token.
 * Use it for any backend call that needs an owner check.
 */
export async function authHeaders() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Not signed in');
  }
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}
