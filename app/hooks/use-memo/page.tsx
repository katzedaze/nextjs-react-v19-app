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
import { useMemo, useState } from "react";

// 重い計算の模擬
function expensiveCalculation(num: number): number {
  console.log("重い計算を実行中...", num);
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.sqrt(num * i);
  }
  return result;
}

// フィルタリング処理
function filterItems(items: string[], filter: string): string[] {
  console.log("フィルタリング実行中...", items.length, "件");
  return items.filter((item) =>
    item.toLowerCase().includes(filter.toLowerCase())
  );
}

export default function UseMemoPage() {
  // 重い計算のメモ化
  const [number, setNumber] = useState(10);
  const [counter, setCounter] = useState(0);

  const expensiveValue = useMemo(() => {
    return expensiveCalculation(number);
  }, [number]);

  // リストのフィルタリング
  const [items] = useState(() =>
    Array.from({ length: 10000 }, (_, i) => `アイテム ${i + 1}`)
  );
  const [filter, setFilter] = useState("");

  const filteredItems = useMemo(() => {
    return filterItems(items, filter);
  }, [items, filter]);

  // オブジェクトの参照安定化
  const [name, setName] = useState("太郎");
  const [age, setAge] = useState(25);

  const userObject = useMemo(() => {
    return { name, age, id: Date.now() };
  }, [name, age]);

  // 配列の参照安定化
  const [searchTerm, setSearchTerm] = useState("");

  const searchOptions = useMemo(() => {
    return ["検索オプション1", "検索オプション2", "検索オプション3"].filter(
      (option) => option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">useMemo Hook</h1>
        <p className="text-muted-foreground">
          <code>useMemo</code>{" "}
          は、計算コストの高い値をメモ化し、依存配列が変更された場合のみ再計算するHookです。
          パフォーマンスの最適化に役立ちます。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]); // 依存配列`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="calculation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculation">重い計算</TabsTrigger>
          <TabsTrigger value="filtering">フィルタリング</TabsTrigger>
          <TabsTrigger value="object">オブジェクト</TabsTrigger>
          <TabsTrigger value="array">配列</TabsTrigger>
        </TabsList>

        <TabsContent value="calculation">
          <Card>
            <CardHeader>
              <CardTitle>重い計算のメモ化</CardTitle>
              <CardDescription>
                数値が変更された場合のみ再計算（コンソールでログを確認）
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  計算対象の数値: {number}
                </label>
                <Input
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
                  className="w-32"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  再レンダリング用カウンター: {counter}
                </label>
                <Button onClick={() => setCounter(counter + 1)}>
                  カウンター +1
                </Button>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">計算結果:</p>
                <p className="font-mono text-lg">{expensiveValue.toFixed(2)}</p>
              </div>

              <div className="text-sm text-muted-foreground">
                カウンターを変更しても重い計算は再実行されません。
                数値を変更すると再計算されます。
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const expensiveValue = useMemo(() => {
  return expensiveCalculation(number);
}, [number]); // numberが変わった時のみ再計算`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filtering">
          <Card>
            <CardHeader>
              <CardTitle>リストのフィルタリング</CardTitle>
              <CardDescription>
                10,000件のリストを効率的にフィルタリング
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="フィルター条件を入力..."
                />
                <p className="text-sm text-muted-foreground">
                  検索結果: {filteredItems.length} / {items.length} 件
                </p>
              </div>

              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {filteredItems.slice(0, 50).map((item, index) => (
                  <div key={index} className="py-1 border-b last:border-b-0">
                    {item}
                  </div>
                ))}
                {filteredItems.length > 50 && (
                  <div className="py-2 text-center text-muted-foreground">
                    ...他 {filteredItems.length - 50} 個
                  </div>
                )}
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const filteredItems = useMemo(() => {
  return items.filter(item =>
    item.toLowerCase().includes(filter.toLowerCase())
  );
}, [items, filter]); // itemsまたはfilterが変わった時のみ再計算`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="object">
          <Card>
            <CardHeader>
              <CardTitle>オブジェクトの参照安定化</CardTitle>
              <CardDescription>
                子コンポーネントへの不要な再レンダリングを防ぐ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">名前</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">年齢</label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <pre>{JSON.stringify(userObject, null, 2)}</pre>
              </div>

              <div className="text-sm text-muted-foreground">
                nameやageが変更された場合のみ新しいオブジェクトが作成されます。
                これにより、このオブジェクトをpropsとして受け取る子コンポーネントの
                不要な再レンダリングを防げます。
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const userObject = useMemo(() => {
  return { name, age, id: Date.now() };
}, [name, age]); // nameまたはageが変わった時のみ新しいオブジェクト`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="array">
          <Card>
            <CardHeader>
              <CardTitle>配列の参照安定化</CardTitle>
              <CardDescription>
                検索オプションのフィルタリングと参照の安定化
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="検索オプションをフィルター..."
                />
              </div>

              <div className="space-y-2">
                {searchOptions.map((option, index) => (
                  <div key={index} className="p-2 border rounded">
                    {option}
                  </div>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                検索条件が変更された場合のみ配列が再作成されます。
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const searchOptions = useMemo(() => {
  return [
    "検索オプション1",
    "検索オプション2",
    "検索オプション3",
  ].filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [searchTerm]); // searchTermが変わった時のみ再計算`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>useMemoの使用指針</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>計算コストが高い処理でのみ使用する</li>
            <li>参照の等価性が重要な場合（子コンポーネントのpropsなど）</li>
            <li>依存配列を正しく設定して適切なメモ化を行う</li>
            <li>過度な使用は逆にパフォーマンスを悪化させる可能性がある</li>
            <li>プロファイリングツールで効果を測定することが重要</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
