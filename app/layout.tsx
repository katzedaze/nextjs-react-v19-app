import { Providers } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React v19 Hooks Demo",
  description: "React v19の新しいHooksのデモンストレーション",
};

const hooks = [
  { name: "use", path: "/hooks/use" },
  { name: "useActionState", path: "/hooks/use-action-state" },
  { name: "useOptimistic", path: "/hooks/use-optimistic" },
  { name: "useFormStatus", path: "/hooks/use-form-status" },
  { name: "useState", path: "/hooks/use-state" },
  { name: "useEffect", path: "/hooks/use-effect" },
  { name: "useContext", path: "/hooks/use-context" },
  { name: "useReducer", path: "/hooks/use-reducer" },
  { name: "useCallback", path: "/hooks/use-callback" },
  { name: "useMemo", path: "/hooks/use-memo" },
  { name: "useRef", path: "/hooks/use-ref" },
  { name: "useLayoutEffect", path: "/hooks/use-layout-effect" },
  { name: "useTransition", path: "/hooks/use-transition" },
  { name: "useDeferredValue", path: "/hooks/use-deferred-value" },
  { name: "useId", path: "/hooks/use-id" },
  { name: "useSyncExternalStore", path: "/hooks/use-sync-external-store" },
];

const forms = [
  { name: "React Hook Form", path: "/forms/react-hook-form" },
  { name: "Conform", path: "/forms/conform" },
];

const nextjs = [
  { name: "Functions", path: "/nextjs/functions" },
  { name: "Components", path: "/nextjs/components" },
  { name: "ルーティング", path: "/nextjs/routing" },
  { name: "動的ルート", path: "/nextjs/dynamic-routes" },
  { name: "ルートグループ", path: "/nextjs/route-groups" },
  { name: "並列ルート", path: "/nextjs/parallel-routes" },
  { name: "インターセプトルート", path: "/nextjs/intercepting-routes" },
  { name: "Middleware", path: "/nextjs/middleware" },
  { name: "Cookies", path: "/nextjs/cookies" },
  { name: "NextAuth", path: "/nextjs/nextauth" },
];

const auth = [
  { name: "ログイン", path: "/auth/signin" },
  { name: "ダッシュボード", path: "/dashboard" },
  { name: "プロフィール", path: "/profile" },
  { name: "管理画面", path: "/admin" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen">
          <nav className="w-64 border-r border-border bg-background">
            <div className="p-4">
              <Link href="/">
                <h1 className="text-2xl font-bold mb-6">React v19 Hooks</h1>
              </Link>
              <ScrollArea className="h-[calc(100vh-120px)]">
                <div className="space-y-2">
                  <div className="mb-4">
                    <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                      新しいHooks (v19)
                    </h2>
                    {hooks.slice(0, 4).map((hook) => (
                      <Button
                        key={hook.name}
                        variant="ghost"
                        className="w-full justify-start mb-1"
                        asChild
                      >
                        <Link href={hook.path}>{hook.name}</Link>
                      </Button>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                      既存のHooks
                    </h2>
                    {hooks.slice(4).map((hook) => (
                      <Button
                        key={hook.name}
                        variant="ghost"
                        className="w-full justify-start mb-1"
                        asChild
                      >
                        <Link href={hook.path}>{hook.name}</Link>
                      </Button>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                      フォームライブラリ
                    </h2>
                    {forms.map((form) => (
                      <Button
                        key={form.name}
                        variant="ghost"
                        className="w-full justify-start mb-1"
                        asChild
                      >
                        <Link href={form.path}>{form.name}</Link>
                      </Button>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                      Next.js
                    </h2>
                    {nextjs.map((item) => (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="w-full justify-start mb-1"
                        asChild
                      >
                        <Link href={item.path}>{item.name}</Link>
                      </Button>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                      認証・認可
                    </h2>
                    {auth.map((item) => (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="w-full justify-start mb-1"
                        asChild
                      >
                        <Link href={item.path}>{item.name}</Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </nav>
          <main className="flex-1 overflow-auto">
            <Providers>
              <div className="container mx-auto p-8">{children}</div>
            </Providers>
          </main>
        </div>
      </body>
    </html>
  );
}
