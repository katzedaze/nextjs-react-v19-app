"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// DOM測定の例
function DomMeasurementExample() {
  const [items, setItems] = useState([
    "アイテム 1",
    "アイテム 2",
    "アイテム 3",
  ]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    }
  }, [items]);

  const addItem = () => {
    setItems((prev) => [...prev, `アイテム ${prev.length + 1}`]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={addItem}>アイテム追加</Button>
        <Button
          onClick={() => removeItem(items.length - 1)}
          disabled={items.length === 0}
        >
          アイテム削除
        </Button>
      </div>

      <div className="p-4 bg-muted rounded">
        <p className="text-sm">
          コンテナサイズ: {dimensions.width.toFixed(0)}px ×{" "}
          {dimensions.height.toFixed(0)}px
        </p>
      </div>

      <div ref={containerRef} className="border rounded p-4 space-y-2 min-h-32">
        {items.map((item, index) => (
          <div key={index} className="p-2 bg-blue-100 rounded">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// スクロール位置の同期
function ScrollSyncExample() {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      setScrollTop(element.scrollTop);
    };

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  });

  useLayoutEffect(() => {
    if (indicatorRef.current && scrollRef.current) {
      const maxScroll =
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      const percentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      indicatorRef.current.style.width = `${percentage}%`;
    }
  }, [scrollTop]);

  const items = Array.from(
    { length: 50 },
    (_, i) => `スクロールアイテム ${i + 1}`
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>スクロール進行度</span>
          <span>{scrollTop}px</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            ref={indicatorRef}
            className="bg-blue-600 h-2 rounded-full transition-all duration-75"
          />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="h-48 overflow-y-auto border rounded p-4 space-y-2"
      >
        {items.map((item, index) => (
          <div key={index} className="p-2 border-b">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// useEffect vs useLayoutEffect の比較
function EffectComparisonExample() {
  const [count, setCount] = useState(0);
  const [useLayoutFlag, setUseLayoutFlag] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev.slice(-9),
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    addLog("useEffect実行");
    if (boxRef.current && !useLayoutFlag) {
      boxRef.current.style.backgroundColor =
        count % 2 === 0 ? "#f0f0f0" : "#e0e0ff";
    }
  }, [count, useLayoutFlag]);

  useLayoutEffect(() => {
    addLog("useLayoutEffect実行");
    if (boxRef.current && useLayoutFlag) {
      boxRef.current.style.backgroundColor =
        count % 2 === 0 ? "#f0f0f0" : "#e0e0ff";
    }
  }, [count, useLayoutFlag]);

  const increment = () => {
    addLog("ボタンクリック - カウンター更新");
    setCount((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={increment}>カウンター: {count}</Button>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useLayoutFlag}
            onChange={(e) => setUseLayoutFlag(e.target.checked)}
          />
          useLayoutEffectを使用
        </label>
      </div>

      <div
        ref={boxRef}
        className="w-32 h-32 border rounded flex items-center justify-center font-bold"
      >
        {count}
      </div>

      <Alert>
        <AlertDescription>
          useLayoutEffectは同期的に実行されるため、ちらつきが少なくなります。
          useEffectは非同期なので、一瞬元の色が見える場合があります。
        </AlertDescription>
      </Alert>

      <div className="space-y-1 max-h-32 overflow-y-auto bg-muted p-2 rounded text-xs font-mono">
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
}

// ツールチップの位置調整
function TooltipExample() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (showTooltip && buttonRef.current && tooltipRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let x = buttonRect.left + buttonRect.width / 2 - tooltipRect.width / 2;
      let y = buttonRect.top - tooltipRect.height - 8;

      // 画面外に出る場合の調整
      if (x < 0) x = 8;
      if (x + tooltipRect.width > window.innerWidth)
        x = window.innerWidth - tooltipRect.width - 8;
      if (y < 0) y = buttonRect.bottom + 8;

      setTooltipPosition({ x, y });
    }
  }, [showTooltip]);

  return (
    <div className="space-y-4 relative h-64 flex items-center justify-center">
      <Button
        ref={buttonRef}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        ツールチップを表示
      </Button>

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed bg-black text-white px-2 py-1 rounded text-sm z-50"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          これはツールチップです
        </div>
      )}
    </div>
  );
}

// フォーカス管理
function FocusManagementExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const modalInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (isModalOpen && modalInputRef.current) {
      modalInputRef.current.focus();
    } else if (!isModalOpen && openButtonRef.current) {
      openButtonRef.current.focus();
    }
  }, [isModalOpen]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  return (
    <div className="space-y-4">
      <Button ref={openButtonRef} onClick={openModal}>
        モーダルを開く
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-80"
            onKeyDown={handleKeyDown}
          >
            <h3 className="text-lg font-semibold">モーダルダイアログ</h3>

            <div className="space-y-2">
              <Label htmlFor="modal-input">テキスト入力</Label>
              <Input
                ref={modalInputRef}
                id="modal-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="自動的にフォーカスされます..."
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={closeModal}>
                キャンセル
              </Button>
              <Button ref={closeButtonRef} onClick={closeModal}>
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UseLayoutEffectPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">useLayoutEffect Hook</h1>
        <p className="text-muted-foreground">
          <code>useLayoutEffect</code>{" "}
          は、DOM更新後、ブラウザが画面を描画する前に同期的に実行されるHookです。
          DOM測定やレイアウト調整が必要な場合に使用します。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`useLayoutEffect(() => {
  // DOM測定やレイアウト調整
  const rect = element.getBoundingClientRect();

  return () => {
    // クリーンアップ
  };
}, [dependencies]);`}</code>
          </pre>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          <strong>useEffect vs useLayoutEffect:</strong>{" "}
          useLayoutEffectは同期的に実行されるため、
          DOM操作による視覚的なちらつきを防げます。ただし、パフォーマンスに影響する可能性があるため、
          必要な場合のみ使用してください。
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="measurement" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="measurement">DOM測定</TabsTrigger>
          <TabsTrigger value="scroll">スクロール</TabsTrigger>
          <TabsTrigger value="comparison">比較</TabsTrigger>
          <TabsTrigger value="tooltip">ツールチップ</TabsTrigger>
          <TabsTrigger value="focus">フォーカス</TabsTrigger>
        </TabsList>

        <TabsContent value="measurement">
          <Card>
            <CardHeader>
              <CardTitle>DOM要素の測定</CardTitle>
              <CardDescription>
                要素のサイズをリアルタイムで測定・表示
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DomMeasurementExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`useLayoutEffect(() => {
  if (containerRef.current) {
    const rect = containerRef.current.getBoundingClientRect();
    setDimensions({ width: rect.width, height: rect.height });
  }
}); // 依存配列なし = 毎回実行`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scroll">
          <Card>
            <CardHeader>
              <CardTitle>スクロール位置の同期</CardTitle>
              <CardDescription>
                スクロール位置に基づくプログレスバーの更新
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollSyncExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`useLayoutEffect(() => {
  if (indicatorRef.current && scrollRef.current) {
    const maxScroll = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    const percentage = (scrollTop / maxScroll) * 100;
    indicatorRef.current.style.width = \`\${percentage}%\`;
  }
}, [scrollTop]);`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>useEffect vs useLayoutEffect</CardTitle>
              <CardDescription>
                実行タイミングの違いを視覚的に比較
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EffectComparisonExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`// useEffect（非同期）
useEffect(() => {
  element.style.backgroundColor = newColor; // ちらつく可能性
}, [count]);

// useLayoutEffect（同期）
useLayoutEffect(() => {
  element.style.backgroundColor = newColor; // ちらつかない
}, [count]);`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tooltip">
          <Card>
            <CardHeader>
              <CardTitle>ツールチップの位置調整</CardTitle>
              <CardDescription>画面端での位置調整を自動実行</CardDescription>
            </CardHeader>
            <CardContent>
              <TooltipExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`useLayoutEffect(() => {
  if (showTooltip && buttonRef.current && tooltipRef.current) {
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let x = buttonRect.left + buttonRect.width / 2 - tooltipRect.width / 2;
    let y = buttonRect.top - tooltipRect.height - 8;

    // 画面外調整
    if (x < 0) x = 8;
    if (y < 0) y = buttonRect.bottom + 8;

    setTooltipPosition({ x, y });
  }
}, [showTooltip]);`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="focus">
          <Card>
            <CardHeader>
              <CardTitle>フォーカス管理</CardTitle>
              <CardDescription>
                モーダルオープン時の自動フォーカス制御
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FocusManagementExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`useLayoutEffect(() => {
  if (isModalOpen && modalInputRef.current) {
    modalInputRef.current.focus(); // モーダル内の要素にフォーカス
  } else if (!isModalOpen && openButtonRef.current) {
    openButtonRef.current.focus(); // モーダルが閉じたら元の要素に戻す
  }
}, [isModalOpen]);`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>useLayoutEffectの使用指針</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>DOM要素のサイズや位置の測定が必要な場合</li>
            <li>視覚的なちらつきを防ぐ必要がある場合</li>
            <li>ツールチップやポップオーバーの位置調整</li>
            <li>フォーカス管理（モーダル、タブナビゲーション）</li>
            <li>スクロール位置の同期処理</li>
            <li>ただし、パフォーマンスへの影響を考慮して必要最小限に使用</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
