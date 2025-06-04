import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const initials =
    session.user?.name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">プロフィール</h1>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session.user?.image || undefined} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl">{session.user?.name}</h2>
                <p className="text-muted-foreground">{session.user?.email}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">基本情報</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">ユーザーID: </span>
                    <span>{session.user?.id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">権限: </span>
                    <Badge
                      variant={
                        session.user?.role === "admin" ? "default" : "secondary"
                      }
                    >
                      {session.user?.role}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">セッション情報</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">有効期限: </span>
                    <span>
                      {new Date(session.expires).toLocaleString("ja-JP")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
