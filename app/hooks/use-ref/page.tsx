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
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";

export default function UseRefPage() {
  // DOM要素への参照
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 値の保存（再レンダリングしない）
  const renderCountRef = useRef(0);
  const [state, setState] = useState(0);

  renderCountRef.current = renderCountRef.current + 1;

  // 前の値の保存
  const [count, setCount] = useState(0);
  const prevCountRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    prevCountRef.current = count;
  });

  // タイマーの管理
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // フォーカス管理
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const selectText = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
    }
  };

  // スクロール制御
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // カスタムフック風の使用例
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // 100ms間隔で状態を更新（パフォーマンス向上）
      setTimeout(() => {
        setPosition({ ...mouseRef.current });
      }, 100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">useRef Hook</h1>
        <p className="text-muted-foreground">
          <code>useRef</code>{" "}
          は、DOM要素への参照や、レンダリング間で保持したい値を格納するためのHookです。
          値の変更は再レンダリングを引き起こしません。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`const ref = useRef(initialValue);

// DOM要素の場合
const inputRef = useRef<HTMLInputElement>(null);
<input ref={inputRef} />

// 値の保存の場合
ref.current = newValue;`}</code>
          </pre>
        </CardContent>
      </Card>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm">
          <strong>レンダリング回数:</strong> {renderCountRef.current}
        </p>
        <p className="text-sm mt-1">
          この値はuseRefで管理されており、変更されても再レンダリングは発生しません。
        </p>
      </div>

      <Tabs defaultValue="dom" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dom">DOM操作</TabsTrigger>
          <TabsTrigger value="previous">前の値</TabsTrigger>
          <TabsTrigger value="timer">タイマー</TabsTrigger>
          <TabsTrigger value="scroll">スクロール</TabsTrigger>
          <TabsTrigger value="mouse">マウス</TabsTrigger>
        </TabsList>

        <TabsContent value="dom">
          <Card>
            <CardHeader>
              <CardTitle>DOM要素への参照</CardTitle>
              <CardDescription>
                input要素やtextarea要素を直接操作
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input ref={inputRef} placeholder="フォーカス対象のinput" />
                <Button onClick={focusInput}>inputにフォーカス</Button>
              </div>

              <div className="space-y-2">
                <Textarea
                  ref={textareaRef}
                  defaultValue="この内容が選択されます"
                  rows={3}
                />
                <Button onClick={selectText}>テキストを全選択</Button>
              </div>

              <div className="space-y-2">
                <video
                  ref={videoRef}
                  width="300"
                  controls
                  className="border rounded"
                >
                  <source src="/sample-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="flex gap-2">
                  <Button onClick={() => videoRef.current?.play()}>再生</Button>
                  <Button onClick={() => videoRef.current?.pause()}>
                    一時停止
                  </Button>
                </div>
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const inputRef = useRef<HTMLInputElement>(null);

<Input ref={inputRef} />

const focusInput = () => {
  inputRef.current?.focus();
};`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="previous">
          <Card>
            <CardHeader>
              <CardTitle>前の値の保存</CardTitle>
              <CardDescription>状態の前の値を比較表示</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold">{count}</div>
                <div className="text-lg text-muted-foreground">
                  前の値: {prevCountRef.current ?? "なし"}
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setCount(count - 1)}>-1</Button>
                  <Button onClick={() => setCount(0)} variant="outline">
                    リセット
                  </Button>
                  <Button onClick={() => setCount(count + 1)}>+1</Button>
                </div>
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const [count, setCount] = useState(0);
const prevCountRef = useRef<number>();

useEffect(() => {
  prevCountRef.current = count;
});

// 前の値: prevCountRef.current`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timer">
          <Card>
            <CardHeader>
              <CardTitle>タイマーの管理</CardTitle>
              <CardDescription>setIntervalの参照をuseRefで管理</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="text-4xl font-mono font-bold">
                  {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                  {String(seconds % 60).padStart(2, "0")}
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => setIsRunning(!isRunning)}
                    variant={isRunning ? "destructive" : "default"}
                  >
                    {isRunning ? "停止" : "開始"}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsRunning(false);
                      setSeconds(0);
                    }}
                    variant="outline"
                  >
                    リセット
                  </Button>
                </div>
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const intervalRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (isRunning) {
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  } else {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [isRunning]);`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scroll">
          <Card>
            <CardHeader>
              <CardTitle>スクロール制御</CardTitle>
              <CardDescription>コンテナのスクロール位置を制御</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={scrollToTop}>先頭へ</Button>
                <Button onClick={scrollToBottom}>末尾へ</Button>
                <Button onClick={() => setState(state + 1)}>
                  再レンダリング発生 ({state})
                </Button>
              </div>

              <div
                ref={scrollContainerRef}
                className="h-48 overflow-y-auto border rounded p-4 bg-muted"
              >
                {Array.from({ length: 100 }, (_, i) => (
                  <div key={i} className="py-2 border-b">
                    スクロールアイテム {i + 1}
                  </div>
                ))}
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const scrollContainerRef = useRef<HTMLDivElement>(null);

const scrollToTop = () => {
  scrollContainerRef.current?.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mouse">
          <Card>
            <CardHeader>
              <CardTitle>マウス位置の追跡</CardTitle>
              <CardDescription>
                パフォーマンスを考慮したマウス位置の管理
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p>
                  マウス位置: X={position.x}, Y={position.y}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  マウスを動かしてみてください
                </p>
              </div>

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`const mouseRef = useRef({ x: 0, y: 0 });

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    // パフォーマンス向上のため間隔を空けて更新
    setTimeout(() => {
      setPosition({ ...mouseRef.current });
    }, 100);
  };

  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, []);`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>useRefの特徴と用途</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>
              DOM要素への直接アクセス（フォーカス、スクロール、メディア制御）
            </li>
            <li>レンダリング間で値を保持（再レンダリングを引き起こさない）</li>
            <li>前の値の保存と比較</li>
            <li>タイマーやイベントリスナーの参照管理</li>
            <li>パフォーマンス最適化（不要な再レンダリングの防止）</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
