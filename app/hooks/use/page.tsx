"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, use } from "react";

// 模擬的なデータフェッチ関数
const fetchUserData = async (
  id: number
): Promise<{ id: number; name: string; email: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`,
  };
};

// Promiseを作成
let userPromise: Promise<{ id: number; name: string; email: string }> | null =
  null;

function UserProfile() {
  if (!userPromise) throw new Error("User promise not initialized");

  // use hookでPromiseを解決
  const user = use(userPromise);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ユーザープロフィール</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          <div>
            <dt className="font-semibold">ID:</dt>
            <dd>{user.id}</dd>
          </div>
          <div>
            <dt className="font-semibold">名前:</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt className="font-semibold">メール:</dt>
            <dd>{user.email}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

function LoadingProfile() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function UseHookPage() {
  const loadUser = (id: number) => {
    userPromise = fetchUserData(id);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold">use Hook</h1>
          <Badge variant="default">v19</Badge>
        </div>
        <p className="text-muted-foreground">
          <code>use</code>{" "}
          は、レンダリング中にリソース（PromiseやContext）を読み取るための新しいHookです。
          Promiseが解決されるまでコンポーネントをサスペンドします。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`const data = use(promise);
// または
const value = use(SomeContext);`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>特徴</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>PromiseまたはContextを受け取ることができる</li>
            <li>値が解決されるまでコンポーネントをサスペンドする</li>
            <li>
              条件付きでレンダリング中に呼び出すことが可能（他のHooksと異なる）
            </li>
            <li>Suspenseと組み合わせて使用する</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>実際のサンプル</CardTitle>
          <CardDescription>
            ボタンをクリックしてユーザーデータを読み込みます（2秒かかります）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => loadUser(1)}>ユーザー1を読み込む</Button>
            <Button onClick={() => loadUser(2)}>ユーザー2を読み込む</Button>
            <Button onClick={() => loadUser(3)}>ユーザー3を読み込む</Button>
          </div>

          {userPromise && (
            <Suspense fallback={<LoadingProfile />}>
              <UserProfile />
            </Suspense>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>コード例</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`function UserProfile() {
  // use hookでPromiseを解決
  const user = use(userPromise);

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// 親コンポーネント
function App() {
  return (
    <Suspense fallback={<LoadingProfile />}>
      <UserProfile />
    </Suspense>
  );
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
