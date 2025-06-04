import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">ダッシュボード</h1>
          <p className="text-muted-foreground">
            ようこそ、{session.user?.name}さん
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>ユーザー情報</CardTitle>
            <CardDescription>あなたのアカウント情報</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <strong>名前:</strong> {session.user?.name}
            </div>
            <div>
              <strong>メール:</strong> {session.user?.email}
            </div>
            <div>
              <strong>ロール:</strong>{" "}
              <Badge
                variant={
                  session.user?.role === "admin" ? "default" : "secondary"
                }
              >
                {session.user?.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>セッション情報</CardTitle>
            <CardDescription>現在のセッション詳細</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <strong>ユーザーID:</strong> {session.user?.id}
            </div>
            <div>
              <strong>セッション期限:</strong> {session.expires}
            </div>
          </CardContent>
        </Card>

        {session.user?.role === "admin" && (
          <Card>
            <CardHeader>
              <CardTitle>管理者機能</CardTitle>
              <CardDescription>管理者のみアクセス可能</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/admin">管理画面へ</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
