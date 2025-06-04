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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useTransition } from "react";

function generateData(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `アイテム ${i + 1}`);
}

function heavyCalculation(input: string): string[] {
  // 重い計算の模擬
  const result: string[] = [];
  for (let i = 0; i < 10000; i++) {
    if (input && `item-${i}`.includes(input.toLowerCase())) {
      result.push(`検索結果 ${i}: ${input}`);
    }
  }
  return result.slice(0, 100); // 最大100件まで
}

export default function UseTransitionPage() {
  // 基本的なuseTransition
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(1000);
  const [items, setItems] = useState<string[]>([]);

  const handleGenerate = () => {
    startTransition(() => {
      const newItems = generateData(count);
      setItems(newItems);
    });
  };

  // 検索機能での使用例
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearchPending, startSearchTransition] = useTransition();

  const handleSearch = (value: string) => {
    setQuery(value);
    startSearchTransition(() => {
      const results = heavyCalculation(value);
      setSearchResults(results);
    });
  };

  // プログレス表示の例
  const [progress, setProgress] = useState(0);
  const [isProgressPending, startProgressTransition] = useTransition();

  const simulateProgress = () => {
    setProgress(0);
    startProgressTransition(() => {
      // 時間のかかる処理の模擬
      for (let i = 0; i <= 100; i += 10) {
        setTimeout(() => {
          setProgress(i);
        }, i * 10);
      }
    });
  };

  // 緊急更新 vs トランジション更新の比較
  const [urgentValue, setUrgentValue] = useState("");
  const [transitionValue, setTransitionValue] = useState("");
  const [isTransitionPending, startValueTransition] = useTransition();

  const handleUrgentChange = (value: string) => {
    setUrgentValue(value); // 即座に更新（緊急更新）
  };

  const handleTransitionChange = (value: string) => {
    startValueTransition(() => {
      setTransitionValue(value); // 遅延される可能性あり
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">useTransition Hook</h1>
        <p className="text-muted-foreground">
          <code>useTransition</code>{" "}
          は、緊急でない状態更新をトランジションとしてマークし、
          UIの応答性を保つための新しいHookです。重い処理中でもUIがブロックされません。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`const [isPending, startTransition] = useTransition();

startTransition(() => {
  // 緊急でない状態更新
  setLargeList(newLargeData);
});`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">基本例</TabsTrigger>
          <TabsTrigger value="search">検索</TabsTrigger>
          <TabsTrigger value="progress">プログレス</TabsTrigger>
          <TabsTrigger value="comparison">比較</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>大量データの生成</CardTitle>
              <CardDescription>
                大量のアイテムを生成する際のトランジション使用例
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1000)}
                  className="w-32"
                  min="100"
                  max="50000"
                />
                <Button onClick={handleGenerate} disabled={isPending}>
                  {isPending ? "生成中..." : "アイテム生成"}
                </Button>
              </div>

              {isPending && (
                <div className="text-sm text-muted-foreground">
                  {count}個のアイテムを生成中...
                </div>
              )}

              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {items.slice(0, 20).map((item, index) => (
                  <div key={index} className="py-1 border-b last:border-b-0">
                    {item}
                  </div>
                ))}
                {items.length > 20 && (
                  <div className="py-2 text-center text-muted-foreground">
                    ...他 {items.length - 20} 個
                  </div>
                )}
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const [isPending, startTransition] = useTransition();

const handleGenerate = () => {
  startTransition(() => {
    const newItems = generateData(count);
    setItems(newItems);
  });
};`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>検索機能</CardTitle>
              <CardDescription>
                重い検索処理でのトランジション使用例
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="検索キーワードを入力..."
                />
                {isSearchPending && (
                  <div className="text-sm text-muted-foreground">
                    検索中... UIはブロックされません
                  </div>
                )}
              </div>

              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {searchResults.length === 0 && query ? (
                  <div className="text-center text-muted-foreground py-4">
                    結果が見つかりません
                  </div>
                ) : (
                  searchResults.map((result, index) => (
                    <div key={index} className="py-1 border-b last:border-b-0">
                      {result}
                    </div>
                  ))
                )}
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const handleSearch = (value: string) => {
  setQuery(value); // 即座に入力値を更新

  startTransition(() => {
    // 重い検索処理をトランジションでマーク
    const results = heavyCalculation(value);
    setSearchResults(results);
  });
};`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>プログレス表示</CardTitle>
              <CardDescription>長時間処理のプログレス管理</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button onClick={simulateProgress} disabled={isProgressPending}>
                  {isProgressPending ? "処理中..." : "長時間処理を開始"}
                </Button>
                <Progress value={progress} className="w-full" />
                <div className="text-sm text-muted-foreground">
                  進行状況: {progress}%
                </div>
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const simulateProgress = () => {
  setProgress(0);
  startTransition(() => {
    // 長時間処理をトランジションでマーク
    for (let i = 0; i <= 100; i += 10) {
      setTimeout(() => {
        setProgress(i);
      }, i * 10);
    }
  });
};`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>緊急更新 vs トランジション更新</CardTitle>
              <CardDescription>更新の優先度による違いを比較</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    緊急更新（即座）
                  </label>
                  <Input
                    onChange={(e) => handleUrgentChange(e.target.value)}
                    placeholder="緊急更新のテスト"
                  />
                  <div className="p-2 bg-green-50 border border-green-200 rounded">
                    値: {urgentValue}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    トランジション更新
                    {isTransitionPending && " (保留中)"}
                  </label>
                  <Input
                    onChange={(e) => handleTransitionChange(e.target.value)}
                    placeholder="トランジション更新のテスト"
                  />
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                    値: {transitionValue}
                  </div>
                </div>
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// 緊急更新（高優先度）
setUrgentValue(value);

// トランジション更新（低優先度）
startTransition(() => {
  setTransitionValue(value);
});`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>useTransitionの特徴</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>緊急でない状態更新をマークして、UIの応答性を保つ</li>
            <li>ユーザーインタラクションを優先し、重い処理は後回しにする</li>
            <li>isPendingフラグでローディング状態を管理できる</li>
            <li>Concurrent Featuresの一部として動作</li>
            <li>レンダリング中に中断・再開が可能</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
