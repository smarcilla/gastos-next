"use client";

import { Button } from "@/components/ui/button";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();
  const auth = useGoogleAuth();

  const handleClick = async () => {
    await auth.login();
    router.push("/");
  };

  return (
    <Button aria-label="Sign in with Google" onClick={handleClick}>
      Sign in with Google
    </Button>
  );
}
