import { useMutation } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { googleAuthService } from "@/lib/google/service";

export interface AuthState {
  isAuthenticated: boolean;
  userProfile?: unknown;
}

type Listener = () => void;
const listeners = new Set<Listener>();
let state: AuthState = { isAuthenticated: false };

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): AuthState {
  return state;
}

function setState(partial: AuthState) {
  state = partial;
  listeners.forEach((l) => l());
}

async function loginRequest() {
  const url = await googleAuthService.signIn();
  if (typeof window !== "undefined") {
    window.location.href = url;
  }
  setState({ isAuthenticated: true, userProfile: undefined });
}

async function logoutRequest() {
  await googleAuthService.signOut();
  setState({ isAuthenticated: false, userProfile: undefined });
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
  const loginMut = useMutation({ mutationFn: loginRequest });
  const logoutMut = useMutation({ mutationFn: logoutRequest });
  const { isAuthenticated, userProfile } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );

  return {
    login: loginMut.mutateAsync,
    logout: logoutMut.mutateAsync,
    isAuthenticated,
    userProfile,
  } as const;
}
