"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";

type FormState = {
  message: string;
  isError: boolean;
  timestamp?: string;
};

async function submitForm(
  _previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  // 模擬的な非同期処理
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // バリデーション
  if (!name || !email) {
    return {
      message: "名前とメールアドレスは必須です",
      isError: true,
      timestamp: new Date().toISOString(),
    };
  }

  if (!email.includes("@")) {
    return {
      message: "有効なメールアドレスを入力してください",
      isError: true,
      timestamp: new Date().toISOString(),
    };
  }

  // 成功
  return {
    message: `${name}さん、登録ありがとうございます！`,
    isError: false,
    timestamp: new Date().toISOString(),
  };
}

export default function UseActionStatePage() {
  const [state, formAction, isPending] = useActionState(submitForm, {
    message: "",
    isError: false,
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold">useActionState Hook</h1>
          <Badge variant="default">v19</Badge>
        </div>
        <p className="text-muted-foreground">
          <code>useActionState</code>{" "}
          は、フォームアクションの状態を管理するための新しいHookです。
          フォームの送信状態とレスポンスを簡単に扱うことができます。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`const [state, formAction, isPending] = useActionState(
  async (previousState, formData) => {
    // フォーム処理
    return newState;
  },
  initialState
);`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>特徴</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>フォームアクションの状態管理を簡素化</li>
            <li>非同期処理中のペンディング状態を自動管理</li>
            <li>プログレッシブエンハンスメントをサポート</li>
            <li>Server Actionsと組み合わせて使用可能</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>実際のサンプル</CardTitle>
          <CardDescription>
            フォームを送信してuseActionStateの動作を確認してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">名前</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="山田太郎"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="taro@example.com"
                disabled={isPending}
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "送信中..." : "送信"}
            </Button>
          </form>

          {state.message && (
            <Alert
              className="mt-4"
              variant={state.isError ? "destructive" : "default"}
            >
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {state.timestamp && (
            <p className="text-sm text-muted-foreground mt-2">
              最終更新: {new Date(state.timestamp).toLocaleString("ja-JP")}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>コード例</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    async (previousState, formData) => {
      const name = formData.get("name");
      const email = formData.get("email");

      // バリデーションと送信処理
      if (!name || !email) {
        return { error: "必須項目を入力してください" };
      }

      await submitToServer({ name, email });
      return { success: true };
    },
    { error: null, success: false }
  );

  return (
    <form action={formAction}>
      <input name="name" disabled={isPending} />
      <input name="email" disabled={isPending} />
      <button disabled={isPending}>
        {isPending ? "送信中..." : "送信"}
      </button>
      {state.error && <p>{state.error}</p>}
    </form>
  );
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
