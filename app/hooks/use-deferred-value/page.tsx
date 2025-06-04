"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeferredValue, useMemo, useState } from "react";

// 重い処理の模擬
function SlowList({
  query,
  count,
  isDeferred,
}: {
  query: string;
  count: number;
  isDeferred: boolean;
}) {
  const items = useMemo(() => {
    const start = performance.now();
    const result = [];

    for (let i = 0; i < count; i++) {
      if (query === "" || `アイテム ${i + 1}`.includes(query)) {
        result.push(`アイテム ${i + 1}`);
      }
    }

    const end = performance.now();
    console.log(
      `${isDeferred ? "Deferred" : "Normal"} SlowList レンダリング時間: ${
        end - start
      }ms`
    );

    return result;
  }, [query, count, isDeferred]);

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">
        {isDeferred ? "遅延値" : "通常値"}: &quot;{query}&quot; ({items.length}{" "}
        件)
      </div>
      <div className="max-h-48 overflow-y-auto border rounded p-2">
        {items.slice(0, 50).map((item, index) => (
          <div key={index} className="py-1 border-b last:border-b-0">
            {item}
          </div>
        ))}
        {items.length > 50 && (
          <div className="py-2 text-center text-muted-foreground">
            ...他 {items.length - 50} 個
          </div>
        )}
      </div>
    </div>
  );
}

// 視覚的な表示コンポーネント
function VisualizationGrid({
  count,
  isDeferred,
}: {
  count: number;
  isDeferred: boolean;
}) {
  const items = useMemo(() => {
    const start = performance.now();
    const result = Array.from({ length: Math.min(count, 1000) }, (_, i) => ({
      id: i,
      color: `hsl(${(i * 137.508) % 360}, 70%, 50%)`,
    }));

    const end = performance.now();
    console.log(
      `${isDeferred ? "Deferred" : "Normal"} Grid レンダリング時間: ${
        end - start
      }ms`
    );

    return result;
  }, [count, isDeferred]);

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">
        {isDeferred ? "遅延値" : "通常値"}: {count} 個のアイテム
      </div>
      <div className="grid grid-cols-20 gap-1 max-h-48 overflow-y-auto p-2 border rounded">
        {items.map((item) => (
          <div
            key={item.id}
            className="w-4 h-4 rounded"
            style={{ backgroundColor: item.color }}
            title={`アイテム ${item.id + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function UseDeferredValuePage() {
  // 検索の例
  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);
  const [itemCount] = useState(5000);

  // スライダーの例
  const [sliderValue, setSliderValue] = useState([100]);
  const deferredSliderValue = useDeferredValue(sliderValue[0]);

  // テキスト入力の例
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);

  // 複雑なデータの例
  const [complexData, setComplexData] = useState({
    search: "",
    category: "all",
    sortBy: "name",
  });
  const deferredComplexData = useDeferredValue(complexData);

  const complexResults = useMemo(() => {
    // 重い処理の模擬
    const start = performance.now();
    const items = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `商品 ${i + 1}`,
      category: ["electronics", "clothing", "books"][i % 3],
      price: Math.floor(Math.random() * 10000) + 1000,
    }));

    let filtered = items;

    if (deferredComplexData.search) {
      filtered = filtered.filter((item) =>
        item.name.includes(deferredComplexData.search)
      );
    }

    if (deferredComplexData.category !== "all") {
      filtered = filtered.filter(
        (item) => item.category === deferredComplexData.category
      );
    }

    if (deferredComplexData.sortBy === "price") {
      filtered.sort((a, b) => a.price - b.price);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    const end = performance.now();
    console.log(`複雑なデータ処理時間: ${end - start}ms`);

    return filtered.slice(0, 100);
  }, [deferredComplexData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">useDeferredValue Hook</h1>
        <p className="text-muted-foreground">
          <code>useDeferredValue</code>{" "}
          は、値の更新を遅延させて、緊急な更新を優先するためのHookです。
          重い処理を伴うコンポーネントのパフォーマンスを向上させます。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`const [value, setValue] = useState(initialValue);
const deferredValue = useDeferredValue(value);

// valueは即座に更新されるが、
// deferredValueは緊急な更新がない時に更新される`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search">検索</TabsTrigger>
          <TabsTrigger value="slider">スライダー</TabsTrigger>
          <TabsTrigger value="text">テキスト</TabsTrigger>
          <TabsTrigger value="complex">複雑データ</TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>検索のパフォーマンス向上</CardTitle>
              <CardDescription>
                入力は即座に反映され、重い検索処理は遅延されます（コンソールで処理時間を確認）
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="検索キーワードを入力..."
              />

              <div className="text-sm space-y-1">
                <p>入力値: &quot;{searchQuery}&quot;</p>
                <p>遅延値: &quot;{deferredQuery}&quot;</p>
                <p className="text-muted-foreground">
                  {searchQuery !== deferredQuery ? "遅延中..." : "同期済み"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SlowList
                  query={searchQuery}
                  count={itemCount}
                  isDeferred={false}
                />
                <SlowList
                  query={deferredQuery}
                  count={itemCount}
                  isDeferred={true}
                />
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const [searchQuery, setSearchQuery] = useState("");
const deferredQuery = useDeferredValue(searchQuery);

// 入力フィールドは即座に更新
<Input value={searchQuery} onChange={...} />

// 重い検索処理は遅延値を使用
<SearchResults query={deferredQuery} />`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slider">
          <Card>
            <CardHeader>
              <CardTitle>スライダーの値の遅延</CardTitle>
              <CardDescription>
                スライダーは滑らかに動き、重い計算は遅延されます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>アイテム数: {sliderValue[0]}</Label>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={2000}
                  min={10}
                  step={10}
                />
              </div>

              <div className="text-sm space-y-1">
                <p>現在値: {sliderValue[0]}</p>
                <p>遅延値: {deferredSliderValue}</p>
                <p className="text-muted-foreground">
                  {sliderValue[0] !== deferredSliderValue
                    ? "遅延中..."
                    : "同期済み"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <VisualizationGrid count={sliderValue[0]} isDeferred={false} />
                <VisualizationGrid
                  count={deferredSliderValue}
                  isDeferred={true}
                />
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const [sliderValue, setSliderValue] = useState([100]);
const deferredSliderValue = useDeferredValue(sliderValue[0]);

// スライダーは滑らかに動作
<Slider value={sliderValue} onValueChange={setSliderValue} />

// 重い描画処理は遅延値を使用
<HeavyVisualization count={deferredSliderValue} />`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>テキスト入力の最適化</CardTitle>
              <CardDescription>
                入力は即座に表示され、処理は遅延されます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="長いテキストを入力してみてください..."
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">即座に更新される表示</h4>
                  <div className="p-4 border rounded bg-green-50">
                    <p className="text-sm">入力値: &quot;{text}&quot;</p>
                    <p className="text-sm">文字数: {text.length}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">遅延される重い処理</h4>
                  <div className="p-4 border rounded bg-blue-50">
                    <p className="text-sm">
                      遅延値: &quot;{deferredText}&quot;
                    </p>
                    <p className="text-sm">文字数: {deferredText.length}</p>
                    <p className="text-sm">
                      単語数: {deferredText.split(" ").filter((w) => w).length}
                    </p>
                  </div>
                </div>
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const [text, setText] = useState("");
const deferredText = useDeferredValue(text);

// 即座に更新される入力フィールド
<Input value={text} onChange={setText} />

// 重い処理は遅延値を使用
<ExpensiveTextAnalysis text={deferredText} />`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complex">
          <Card>
            <CardHeader>
              <CardTitle>複雑なデータの遅延</CardTitle>
              <CardDescription>
                複数の条件を持つフィルタリング処理
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>検索</Label>
                  <Input
                    value={complexData.search}
                    onChange={(e) =>
                      setComplexData((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    placeholder="商品名で検索..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>カテゴリ</Label>
                  <select
                    value={complexData.category}
                    onChange={(e) =>
                      setComplexData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="all">すべて</option>
                    <option value="electronics">電子機器</option>
                    <option value="clothing">衣類</option>
                    <option value="books">書籍</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>ソート</Label>
                  <select
                    value={complexData.sortBy}
                    onChange={(e) =>
                      setComplexData((prev) => ({
                        ...prev,
                        sortBy: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="name">名前順</option>
                    <option value="price">価格順</option>
                  </select>
                </div>
              </div>

              <div className="text-sm space-y-1">
                <p>現在の条件: {JSON.stringify(complexData)}</p>
                <p>遅延条件: {JSON.stringify(deferredComplexData)}</p>
                <p className="text-muted-foreground">
                  結果: {complexResults.length} 件
                </p>
              </div>

              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {complexResults.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-1 border-b last:border-b-0"
                  >
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">
                      ¥{item.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const [complexData, setComplexData] = useState({
  search: "", category: "all", sortBy: "name"
});
const deferredComplexData = useDeferredValue(complexData);

// UIは即座に更新
<SearchForm data={complexData} onChange={setComplexData} />

// 重い処理は遅延データを使用
const results = useMemo(() => {
  return expensiveFilter(deferredComplexData);
}, [deferredComplexData]);`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>useDeferredValueの特徴</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>UIの応答性を保ちながら重い処理を遅延</li>
            <li>入力フィールドなどの緊急な更新を優先</li>
            <li>useTransitionと組み合わせて効果的</li>
            <li>デバウンスとは異なり、Reactの並行機能を活用</li>
            <li>過度な使用は逆に複雑性を増す可能性</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
