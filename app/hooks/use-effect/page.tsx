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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

export default function UseEffectPage() {
  // タイマーの例
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      // クリーンアップ関数
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  // APIフェッチの例
  const [userId, setUserId] = useState("1");
  const [userData, setUserData] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        // 模擬的なAPI呼び出し
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUserData({
          id: userId,
          name: `ユーザー ${userId}`,
          email: `user${userId}@example.com`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // イベントリスナーの例
  const [windowWidth, setWindowWidth] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 初期値を設定
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // クリーンアップ
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // 空の依存配列 = マウント時のみ実行

  // ローカルストレージの例
  const [savedText, setSavedText] = useState("");

  useEffect(() => {
    // 初回読み込み
    const saved = localStorage.getItem("useEffectExample");
    if (saved) {
      setSavedText(saved);
    }
  }, []);

  useEffect(() => {
    // 保存
    if (savedText) {
      localStorage.setItem("useEffectExample", savedText);
    }
  }, [savedText]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">useEffect Hook</h1>
        <p className="text-muted-foreground">
          <code>useEffect</code>{" "}
          は、コンポーネントを外部システムと同期させるためのHookです。
          副作用の実行、クリーンアップ、依存配列による最適化が可能です。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`useEffect(() => {
  // 副作用の実行

  return () => {
    // クリーンアップ（オプション）
  };
}, [dependencies]); // 依存配列`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="timer" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timer">タイマー</TabsTrigger>
          <TabsTrigger value="fetch">データ取得</TabsTrigger>
          <TabsTrigger value="events">イベント</TabsTrigger>
          <TabsTrigger value="storage">ストレージ</TabsTrigger>
        </TabsList>

        <TabsContent value="timer">
          <Card>
            <CardHeader>
              <CardTitle>タイマーの実装</CardTitle>
              <CardDescription>
                setIntervalを使用したカウントアップタイマー
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold mb-4">
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
                <code>{`useEffect(() => {
  if (isRunning) {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // クリーンアップ関数
    return () => clearInterval(interval);
  }
}, [isRunning]);`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fetch">
          <Card>
            <CardHeader>
              <CardTitle>データの取得</CardTitle>
              <CardDescription>useEffectでAPIからデータを取得</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="ユーザーID"
                  className="w-32"
                />
              </div>

              {loading ? (
                <div className="text-center p-4">読み込み中...</div>
              ) : userData ? (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold">{userData.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {userData.email}
                  </p>
                </div>
              ) : null}

              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`useEffect(() => {
  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(\`/api/users/\${userId}\`);
      const data = await response.json();
      setUserData(data);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [userId]); // userIdが変わるたびに実行`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>イベントリスナー</CardTitle>
              <CardDescription>
                ウィンドウサイズとマウス位置の追跡
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="p-4 bg-muted rounded-lg">
                  <p>ウィンドウ幅: {windowWidth}px</p>
                  <p>
                    マウス位置: X={mousePosition.x}, Y={mousePosition.y}
                  </p>
                </div>
                <Alert>
                  <AlertDescription>
                    ウィンドウをリサイズしたり、マウスを動かしてみてください
                  </AlertDescription>
                </Alert>
              </div>
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  window.addEventListener("resize", handleResize);

  // クリーンアップ関数でリスナーを削除
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []); // 空の配列 = マウント時のみ`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>ローカルストレージ</CardTitle>
              <CardDescription>入力内容を自動的に保存</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  value={savedText}
                  onChange={(e) => setSavedText(e.target.value)}
                  placeholder="入力内容は自動保存されます..."
                />
                <p className="text-sm text-muted-foreground">
                  このテキストはブラウザに保存され、ページをリロードしても残ります
                </p>
              </div>
              <pre className="bg-muted p-4 rounded-lg text-sm">
                <code>{`// 読み込み
useEffect(() => {
  const saved = localStorage.getItem("key");
  if (saved) setSavedText(saved);
}, []);

// 保存
useEffect(() => {
  localStorage.setItem("key", savedText);
}, [savedText]);`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>useEffectの重要なルール</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>副作用は同期的に実行してはいけない（レンダリング後に実行）</li>
            <li>クリーンアップ関数を返すことで、メモリリークを防ぐ</li>
            <li>依存配列を正しく設定して、不要な再実行を避ける</li>
            <li>
              空の依存配列 <code>[]</code> はマウント時のみ実行
            </li>
            <li>依存配列を省略すると、毎回のレンダリング後に実行</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
