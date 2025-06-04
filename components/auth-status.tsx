"use client";

import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AuthStatus() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2 space-y-2 border-t">
        <div className="h-10 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  if (status === "loading") {
    return <div className="p-2 text-sm text-muted-foreground">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="p-2 space-y-2 border-t">
        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/signin">ログイン</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2 border-t">
      <div className="text-sm">
        <div className="font-medium">{session.user?.name}</div>
        <div className="text-muted-foreground text-xs">
          {session.user?.email}
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}
