"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function UseStatePage() {
  // カウンターの例
  const [count, setCount] = useState(0);

  // テキスト入力の例
  const [text, setText] = useState("");

  // オブジェクトの状態管理
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: 0,
  });

  // 配列の状態管理
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem]);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">useState Hook</h1>
        <p className="text-muted-foreground">
          <code>useState</code>{" "}
          は、コンポーネントに状態変数を追加するための基本的なHookです。
          状態の現在値と、その状態を更新する関数を返します。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`const [state, setState] = useState(initialValue);

// 更新方法
setState(newValue);
// または
setState(prevState => prevState + 1);`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="counter" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="counter">カウンター</TabsTrigger>
          <TabsTrigger value="text">テキスト入力</TabsTrigger>
          <TabsTrigger value="object">オブジェクト</TabsTrigger>
          <TabsTrigger value="array">配列</TabsTrigger>
        </TabsList>

        <TabsContent value="counter">
          <Card>
            <CardHeader>
              <CardTitle>カウンターの例</CardTitle>
              <CardDescription>数値の状態管理の基本的な例</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-center p-4">{count}</div>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setCount(count - 1)}>-1</Button>
                <Button onClick={() => setCount(0)} variant="outline">
                  リセット
                </Button>
                <Button onClick={() => setCount(count + 1)}>+1</Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const [count, setCount] = useState(0);

<Button onClick={() => setCount(count + 1)}>
  +1
</Button>`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>テキスト入力の例</CardTitle>
              <CardDescription>フォーム入力の状態管理</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">テキストを入力</Label>
                <Input
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="何か入力してください..."
                />
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">入力されたテキスト:</p>
                <p className="font-mono">{text || "（未入力）"}</p>
                <p className="text-sm mt-2">文字数: {text.length}</p>
              </div>
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const [text, setText] = useState("");

<Input
  value={text}
  onChange={(e) => setText(e.target.value)}
/>`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="object">
          <Card>
            <CardHeader>
              <CardTitle>オブジェクトの状態管理</CardTitle>
              <CardDescription>複雑な状態の管理方法</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">名前</Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  placeholder="名前"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">メール</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="メールアドレス"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">年齢</Label>
                <Input
                  id="age"
                  type="number"
                  value={user.age}
                  onChange={(e) =>
                    setUser({ ...user, age: parseInt(e.target.value) || 0 })
                  }
                  placeholder="年齢"
                />
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <pre>{JSON.stringify(user, null, 2)}</pre>
              </div>
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const [user, setUser] = useState({
  name: "",
  email: "",
  age: 0,
});

// スプレッド構文で更新
setUser({ ...user, name: e.target.value });`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="array">
          <Card>
            <CardHeader>
              <CardTitle>配列の状態管理</CardTitle>
              <CardDescription>リストの追加・削除の実装</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="アイテムを入力..."
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                />
                <Button onClick={addItem}>追加</Button>
              </div>
              <div className="space-y-2">
                {items.length === 0 ? (
                  <p className="text-muted-foreground text-center p-4">
                    アイテムがありません
                  </p>
                ) : (
                  items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span>{item}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(index)}
                      >
                        削除
                      </Button>
                    </div>
                  ))
                )}
              </div>
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const [items, setItems] = useState<string[]>([]);

// 追加
setItems([...items, newItem]);

// 削除
setItems(items.filter((_, i) => i !== index));`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>useStateの重要なポイント</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>状態の更新は非同期的に行われる</li>
            <li>
              オブジェクトや配列を更新する際は、新しい参照を作成する必要がある
            </li>
            <li>関数型の更新を使用すると、前の状態を基に更新できる</li>
            <li>
              初期値が高コストな計算の場合は、関数を渡して遅延初期化できる
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
