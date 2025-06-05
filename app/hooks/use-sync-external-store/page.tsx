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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useState, useSyncExternalStore } from "react";

// ブラウザAPI: オンライン状態の監視
function OnlineStatusExample() {
  const subscribe = useCallback((callback: () => void) => {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("online", callback);
    window.addEventListener("offline", callback);
    return () => {
      window.removeEventListener("online", callback);
      window.removeEventListener("offline", callback);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  }, []);

  const getServerSnapshot = useCallback(() => true, []);

  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="font-medium">
          {isOnline ? "オンライン" : "オフライン"}
        </span>
        <Badge variant={isOnline ? "default" : "destructive"}>
          {isOnline ? "接続中" : "切断"}
        </Badge>
      </div>

      <div className="text-sm text-muted-foreground">
        ネットワーク接続を切断/再接続してステータスの変化を確認してください。
      </div>
    </div>
  );
}

// カスタムストア: カウンター
class CounterStore {
  private count = 0;
  private listeners = new Set<() => void>();

  subscribe = (callback: () => void) => {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  };

  getSnapshot = () => this.count;

  increment = () => {
    this.count++;
    this.listeners.forEach((callback) => callback());
  };

  decrement = () => {
    this.count--;
    this.listeners.forEach((callback) => callback());
  };

  reset = () => {
    this.count = 0;
    this.listeners.forEach((callback) => callback());
  };
}

const counterStore = new CounterStore();

function CounterStoreExample() {
  const count = useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getSnapshot,
    () => 0
  );

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-4xl font-bold mb-4">{count}</div>
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={counterStore.decrement}>-1</Button>
        <Button onClick={counterStore.reset} variant="outline">
          リセット
        </Button>
        <Button onClick={counterStore.increment}>+1</Button>
      </div>

      <div className="text-sm text-muted-foreground">
        このカウンターは外部ストアで管理され、複数のコンポーネント間で同期されます。
      </div>
    </div>
  );
}

// ローカルストレージとの同期
function createLocalStorageStore(key: string, defaultValue: string) {
  return {
    subscribe: (callback: () => void) => {
      const handleStorage = (e: StorageEvent) => {
        if (e.key === key) {
          callback();
        }
      };

      if (typeof window !== "undefined") {
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
      }
      return () => {};
    },

    getSnapshot: () => {
      if (typeof window === "undefined") return defaultValue;
      try {
        return localStorage.getItem(key) ?? defaultValue;
      } catch {
        return defaultValue;
      }
    },

    getServerSnapshot: () => defaultValue,

    setValue: (value: string) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(key, value);
        // storage イベントは同一タブでは発火しないため、手動でイベントを作成
        window.dispatchEvent(new StorageEvent("storage", { key }));
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
      }
    },
  };
}

function LocalStorageExample() {
  const [inputValue, setInputValue] = useState("");

  const store = createLocalStorageStore("useSyncExternalStore-demo", "");

  const storedValue = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  const saveToStorage = () => {
    if (inputValue.trim()) {
      store.setValue(inputValue);
      setInputValue("");
    }
  };

  const clearStorage = () => {
    store.setValue("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="ローカルストレージに保存する値..."
          onKeyDown={(e) => e.key === "Enter" && saveToStorage()}
        />
        <Button onClick={saveToStorage}>保存</Button>
      </div>

      <div className="p-4 bg-muted rounded">
        <h4 className="font-semibold mb-2">ローカルストレージの値</h4>
        <p className="font-mono text-sm">{storedValue || "(空)"}</p>
      </div>

      <div className="flex gap-2">
        <Button onClick={clearStorage} variant="outline">
          クリア
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        別のタブでこのページを開いて、値の同期を確認してください。
      </div>
    </div>
  );
}

export default function UseSyncExternalStorePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">useSyncExternalStore Hook</h1>
        <p className="text-muted-foreground">
          <code>useSyncExternalStore</code>{" "}
          は、外部ストア（ブラウザAPI、グローバル変数、サードパーティライブラリなど）
          にコンポーネントを同期させるためのHookです。Concurrent
          Renderingに対応した安全な外部ストア購読を提供します。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`const value = useSyncExternalStore(
  subscribe,     // 購読関数
  getSnapshot,   // 現在の値を取得する関数
  getServerSnapshot // サーバーサイド用のスナップショット（オプション）
);

// 購読関数の例
const subscribe = (callback) => {
  window.addEventListener('online', callback);
  return () => window.removeEventListener('online', callback);
};

// スナップショット関数の例
const getSnapshot = () => navigator.onLine;`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="online" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="online">オンライン</TabsTrigger>
          <TabsTrigger value="counter">カウンター</TabsTrigger>
          <TabsTrigger value="storage">ストレージ</TabsTrigger>
        </TabsList>

        <TabsContent value="online">
          <Card>
            <CardHeader>
              <CardTitle>オンライン状態の監視</CardTitle>
              <CardDescription>
                ブラウザのオンライン/オフライン状態をリアルタイムで監視
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OnlineStatusExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`const isOnline = useSyncExternalStore(
  (callback) => {
    window.addEventListener("online", callback);
    window.addEventListener("offline", callback);
    return () => {
      window.removeEventListener("online", callback);
      window.removeEventListener("offline", callback);
    };
  },
  () => navigator.onLine,
  () => true // サーバーサイドでのデフォルト値
);`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="counter">
          <Card>
            <CardHeader>
              <CardTitle>カスタムカウンターストア</CardTitle>
              <CardDescription>
                外部ストアとしてのカウンターの実装
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CounterStoreExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`class CounterStore {
  private count = 0;
  private listeners = new Set<() => void>();

  subscribe = (callback: () => void) => {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  };

  getSnapshot = () => this.count;

  increment = () => {
    this.count++;
    this.listeners.forEach(callback => callback());
  };
}

const counterStore = new CounterStore();

// コンポーネント内で使用
const count = useSyncExternalStore(
  counterStore.subscribe,
  counterStore.getSnapshot,
  () => 0
);`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>ローカルストレージとの同期</CardTitle>
              <CardDescription>
                ローカルストレージの値をタブ間で同期
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LocalStorageExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`function createLocalStorageStore(key: string, defaultValue: string) {
  return {
    subscribe: (callback: () => void) => {
      const handleStorage = (e: StorageEvent) => {
        if (e.key === key) callback();
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    },

    getSnapshot: () => localStorage.getItem(key) ?? defaultValue,
    getServerSnapshot: () => defaultValue,

    setValue: (value: string) => {
      localStorage.setItem(key, value);
      window.dispatchEvent(new StorageEvent("storage", { key }));
    },
  };
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>useSyncExternalStoreの特徴と用途</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>
              ブラウザAPIの変更監視（オンライン状態、ウィンドウサイズ、メディアクエリ等）
            </li>
            <li>グローバル状態管理ライブラリとの統合</li>
            <li>ローカルストレージやセッションストレージとの同期</li>
            <li>WebSocket、Server-Sent Events等のリアルタイム通信</li>
            <li>サードパーティライブラリの状態購読</li>
            <li>Concurrent Renderingに対応した安全な外部ストア購読</li>
            <li>SSR（サーバーサイドレンダリング）との互換性</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
