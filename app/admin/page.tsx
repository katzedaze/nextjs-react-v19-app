import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user?.role !== "admin") {
    redirect("/dashboard")
  }

  const mockUsers = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      status: "active"
    },
    {
      id: "2",
      name: "Regular User",
      email: "user@example.com",
      role: "user",
      status: "active"
    },
    {
      id: "3",
      name: "Test User",
      email: "test@example.com", 
      role: "user",
      status: "inactive"
    }
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">管理画面</h1>
        <p className="text-muted-foreground">システム管理者のみアクセス可能</p>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          管理者権限でログインしています。この画面は管理者のみがアクセスできます。
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>システム統計</CardTitle>
            <CardDescription>システムの概要情報</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold">{mockUsers.length}</div>
                <div className="text-sm text-muted-foreground">総ユーザー数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {mockUsers.filter(u => u.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">アクティブユーザー</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {mockUsers.filter(u => u.role === "admin").length}
                </div>
                <div className="text-sm text-muted-foreground">管理者数</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ユーザー管理</CardTitle>
            <CardDescription>登録されているユーザーの一覧</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                    <Badge 
                      variant={user.status === "active" ? "default" : "outline"}
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}