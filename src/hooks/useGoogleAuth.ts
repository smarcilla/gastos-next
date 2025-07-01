import { useMutation } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";

async function loginRequest() {
  await signIn("google");
}

async function logoutRequest() {
  await signOut();
}

/**
 * Subscribes to Google authentication state and exposes login/logout actions.
 *
 * The returned `login` and `logout` functions are React Query mutations
 * executing the underlying `GoogleAuthService` methods.
 *
 * @returns Current authentication state and mutation actions.
 */
export function useGoogleAuth() {
  const { data: session } = useSession();
  const loginMut = useMutation({ mutationFn: loginRequest });
  const logoutMut = useMutation({ mutationFn: logoutRequest });

  return {
    login: loginMut.mutateAsync,
    logout: logoutMut.mutateAsync,
    isAuthenticated: !!session,
    userProfile: session?.user,
  } as const;
}
