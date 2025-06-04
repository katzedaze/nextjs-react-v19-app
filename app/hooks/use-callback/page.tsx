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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { memo, useCallback, useEffect, useState } from "react";

// memo化された子コンポーネント
const MemoizedChild = memo(function ChildComponent({
  onClick,
  name,
}: {
  onClick: () => void;
  name: string;
}) {
  console.log(`${name}コンポーネントがレンダリングされました`);

  return (
    <div className="p-4 border rounded-lg">
      <p className="mb-2">{name}コンポーネント</p>
      <Button onClick={onClick}>{name}クリック</Button>
    </div>
  );
});

// カウンターアイテムコンポーネント
const CounterItem = memo(function CounterItem({
  id,
  count,
  onIncrement,
  onDecrement,
}: {
  id: number;
  count: number;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
}) {
  console.log(`CounterItem ${id} がレンダリングされました`);

  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <span className="w-16">#{id}</span>
      <span className="w-16 text-center font-mono">{count}</span>
      <Button size="sm" onClick={() => onDecrement(id)}>
        -
      </Button>
      <Button size="sm" onClick={() => onIncrement(id)}>
        +
      </Button>
    </div>
  );
});

export default function UseCallbackPage() {
  // useCallback vs 普通の関数の比較
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [otherState, setOtherState] = useState(0);

  // 通常の関数（毎回新しい関数が作成される）
  const handleClick1 = () => {
    setCount1((c) => c + 1);
  };

  // useCallbackでメモ化された関数
  const handleClick2 = useCallback(() => {
    setCount2((c) => c + 1);
  }, []);

  // カウンターリストの例
  const [counters, setCounters] = useState([
    { id: 1, count: 0 },
    { id: 2, count: 0 },
    { id: 3, count: 0 },
  ]);

  const incrementCounter = useCallback((id: number) => {
    setCounters((prev) =>
      prev.map((counter) =>
        counter.id === id ? { ...counter, count: counter.count + 1 } : counter
      )
    );
  }, []);

  const decrementCounter = useCallback((id: number) => {
    setCounters((prev) =>
      prev.map((counter) =>
        counter.id === id ? { ...counter, count: counter.count - 1 } : counter
      )
    );
  }, []);

  // イベントハンドラーの例
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

  const addItem = useCallback(() => {
    if (newItem.trim()) {
      setItems((prev) => [...prev, newItem]);
      setNewItem("");
    }
  }, [newItem]);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // API呼び出しの例
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const search = useCallback(async (term: string) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    // 模擬的なAPI呼び出し
    const results = Array.from(
      { length: 5 },
      (_, i) => `${term} - 結果 ${i + 1}`
    );
    setSearchResults(results);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      search(searchTerm);
    }, 500); // デバウンス

    return () => clearTimeout(timer);
  }, [searchTerm, search]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">useCallback Hook</h1>
        <p className="text-muted-foreground">
          <code>useCallback</code>{" "}
          は、関数をメモ化して不要な再作成を防ぐHookです。
          子コンポーネントの不要な再レンダリングを防ぐために使用されます。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`const memoizedCallback = useCallback(() => {
  // 関数の処理
}, [dependencies]); // 依存配列`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="comparison">比較</TabsTrigger>
          <TabsTrigger value="counters">カウンター</TabsTrigger>
          <TabsTrigger value="list">リスト管理</TabsTrigger>
          <TabsTrigger value="search">検索</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>useCallback vs 通常の関数</CardTitle>
              <CardDescription>
                コンソールでレンダリング回数を確認してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MemoizedChild onClick={handleClick1} name="通常の関数" />
                <MemoizedChild onClick={handleClick2} name="useCallback" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Count 1</p>
                  <p className="text-2xl font-bold">{count1}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Count 2</p>
                  <p className="text-2xl font-bold">{count2}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Other State</p>
                  <p className="text-2xl font-bold">{otherState}</p>
                </div>
              </div>

              <Button onClick={() => setOtherState((s) => s + 1)}>
                他の状態を変更（再レンダリングを発生）
              </Button>

              <div className="text-sm text-muted-foreground">
                「他の状態を変更」ボタンを押すと、通常の関数を使った子コンポーネントのみ再レンダリングされます。
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// 毎回新しい関数が作成される
const handleClick1 = () => setCount1(c => c + 1);

// メモ化された関数
const handleClick2 = useCallback(() => {
  setCount2(c => c + 1);
}, []); // 依存配列が空なので関数は再作成されない`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="counters">
          <Card>
            <CardHeader>
              <CardTitle>複数カウンターの管理</CardTitle>
              <CardDescription>
                各カウンターが独立して動作（コンソールでレンダリング確認）
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {counters.map((counter) => (
                  <CounterItem
                    key={counter.id}
                    id={counter.id}
                    count={counter.count}
                    onIncrement={incrementCounter}
                    onDecrement={decrementCounter}
                  />
                ))}
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const incrementCounter = useCallback((id: number) => {
  setCounters(prev =>
    prev.map(counter =>
      counter.id === id
        ? { ...counter, count: counter.count + 1 }
        : counter
    )
  );
}, []); // 空の依存配列でメモ化`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>リストの管理</CardTitle>
              <CardDescription>アイテムの追加・削除機能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="新しいアイテム..."
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                />
                <Button onClick={addItem}>追加</Button>
              </div>

              <div className="space-y-2">
                {items.map((item, index) => (
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
                ))}
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const addItem = useCallback(() => {
  if (newItem.trim()) {
    setItems(prev => [...prev, newItem]);
    setNewItem("");
  }
}, [newItem]); // newItemに依存

const removeItem = useCallback((index: number) => {
  setItems(prev => prev.filter((_, i) => i !== index));
}, []); // 依存なし`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>デバウンス検索</CardTitle>
              <CardDescription>
                useCallbackとuseEffectを組み合わせた検索機能
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="検索キーワード..."
              />

              <div className="space-y-2">
                {searchResults.map((result, index) => (
                  <div key={index} className="p-2 border rounded">
                    {result}
                  </div>
                ))}
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const search = useCallback(async (term: string) => {
  // API呼び出しのロジック
}, []);

useEffect(() => {
  const timer = setTimeout(() => {
    search(searchTerm);
  }, 500); // 500msのデバウンス

  return () => clearTimeout(timer);
}, [searchTerm, search]); // searchもuseCallbackでメモ化`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>useCallbackの使用指針</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>子コンポーネントにコールバック関数を渡す際に使用</li>
            <li>useEffectの依存配列に関数を含める場合</li>
            <li>計算コストの高い関数をメモ化する場合</li>
            <li>過度な使用は逆にパフォーマンスを悪化させる可能性</li>
            <li>React.memoと組み合わせて効果を発揮</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
