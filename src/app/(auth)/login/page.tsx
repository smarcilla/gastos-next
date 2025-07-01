import { Card } from "@/components/ui/card";
import LoginButton from "./LoginButton";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="p-6">
        <LoginButton />
      </Card>
    </main>
  );
}
