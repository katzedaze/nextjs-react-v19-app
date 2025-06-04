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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createContext, ReactNode, useContext, useState } from "react";

// テーマコンテキスト
type Theme = "light" | "dark";
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// ユーザーコンテキスト
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// カウンターコンテキスト
interface CounterContextType {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(0);

  return (
    <CounterContext.Provider value={{ count, increment, decrement, reset }}>
      {children}
    </CounterContext.Provider>
  );
}

function useCounter() {
  const context = useContext(CounterContext);
  if (context === undefined) {
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return context;
}

// テーマを使用するコンポーネント
function ThemeDisplay() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`p-4 rounded-lg border ${
        theme === "dark"
          ? "bg-gray-800 text-white border-gray-600"
          : "bg-white text-black border-gray-200"
      }`}
    >
      <p className="mb-2">
        現在のテーマ: <Badge>{theme}</Badge>
      </p>
      <div className="flex items-center space-x-2">
        <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        <span>ダークモード</span>
      </div>
    </div>
  );
}

// ユーザー表示コンポーネント
function UserDisplay() {
  const { user, login, logout, updateUser } = useUser();

  const sampleUsers: User[] = [
    { id: 1, name: "山田太郎", email: "yamada@example.com", role: "admin" },
    { id: 2, name: "佐藤花子", email: "sato@example.com", role: "user" },
    { id: 3, name: "田中次郎", email: "tanaka@example.com", role: "guest" },
  ];

  return (
    <div className="space-y-4">
      {user ? (
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">ログイン中のユーザー</h4>
          <p>名前: {user.name}</p>
          <p>メール: {user.email}</p>
          <p>
            ロール: <Badge variant="outline">{user.role}</Badge>
          </p>
          <div className="mt-4 space-x-2">
            <Button onClick={logout} variant="destructive">
              ログアウト
            </Button>
            <Button
              onClick={() => updateUser({ name: user.name + " (更新済み)" })}
              variant="outline"
            >
              名前を更新
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-muted-foreground">ログインしていません</p>
          {sampleUsers.map((sampleUser) => (
            <Button
              key={sampleUser.id}
              onClick={() => login(sampleUser)}
              className="mr-2 mb-2"
              variant="outline"
            >
              {sampleUser.name}でログイン
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

// カウンター表示コンポーネント
function CounterDisplay() {
  const { count, increment, decrement, reset } = useCounter();

  return (
    <div className="text-center space-y-4">
      <div className="text-4xl font-bold">{count}</div>
      <div className="flex gap-2 justify-center">
        <Button onClick={decrement}>-1</Button>
        <Button onClick={reset} variant="outline">
          リセット
        </Button>
        <Button onClick={increment}>+1</Button>
      </div>
    </div>
  );
}

// 複数のコンテキストを使用するコンポーネント
function MultiContextDisplay() {
  const { theme } = useTheme();
  const { user } = useUser();
  const { count } = useCounter();

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-semibold mb-2">複数のコンテキストの使用</h4>
      <p>テーマ: {theme}</p>
      <p>ユーザー: {user?.name || "未ログイン"}</p>
      <p>カウンター: {count}</p>
    </div>
  );
}

export default function UseContextPage() {
  return (
    <ThemeProvider>
      <UserProvider>
        <CounterProvider>
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-4">useContext Hook</h1>
              <p className="text-muted-foreground">
                <code>useContext</code> は、React
                Contextの値を読み取るためのHookです。
                プロップドリリングを避けて、コンポーネントツリー全体で状態を共有できます。
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>基本的な使い方</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`// 1. コンテキストを作成
const MyContext = createContext(defaultValue);

// 2. プロバイダーでラップ
<MyContext.Provider value={value}>
  {children}
</MyContext.Provider>

// 3. コンテキストを使用
const value = useContext(MyContext);`}</code>
                </pre>
              </CardContent>
            </Card>

            <Tabs defaultValue="theme" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="theme">テーマ</TabsTrigger>
                <TabsTrigger value="user">ユーザー</TabsTrigger>
                <TabsTrigger value="counter">カウンター</TabsTrigger>
                <TabsTrigger value="multi">複合</TabsTrigger>
              </TabsList>

              <TabsContent value="theme">
                <Card>
                  <CardHeader>
                    <CardTitle>テーマコンテキスト</CardTitle>
                    <CardDescription>
                      アプリ全体のテーマ設定を管理
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ThemeDisplay />
                    <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                      <code>{`const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}`}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="user">
                <Card>
                  <CardHeader>
                    <CardTitle>ユーザーコンテキスト</CardTitle>
                    <CardDescription>
                      認証状態とユーザー情報の管理
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserDisplay />
                    <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                      <code>{`interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (newUser: User) => setUser(newUser);
  const logout = () => setUser(null);
  const updateUser = (updates: Partial<User>) => {
    if (user) setUser({ ...user, ...updates });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}`}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="counter">
                <Card>
                  <CardHeader>
                    <CardTitle>カウンターコンテキスト</CardTitle>
                    <CardDescription>
                      グローバルなカウンター状態の管理
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CounterDisplay />
                    <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                      <code>{`interface CounterContextType {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  return (
    <CounterContext.Provider value={{ count, increment, decrement, reset }}>
      {children}
    </CounterContext.Provider>
  );
}`}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="multi">
                <Card>
                  <CardHeader>
                    <CardTitle>複数のコンテキストの組み合わせ</CardTitle>
                    <CardDescription>
                      複数のコンテキストを同時に使用
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MultiContextDisplay />
                    <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                      <code>{`function MultiContextDisplay() {
  const { theme } = useTheme();
  const { user } = useUser();
  const { count } = useCounter();

  return (
    <div>
      <p>テーマ: {theme}</p>
      <p>ユーザー: {user?.name || "未ログイン"}</p>
      <p>カウンター: {count}</p>
    </div>
  );
}

// プロバイダーの組み合わせ
<ThemeProvider>
  <UserProvider>
    <CounterProvider>
      <App />
    </CounterProvider>
  </UserProvider>
</ThemeProvider>`}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>useContextの特徴と注意点</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>プロップドリリングを避けて状態を共有</li>
                  <li>
                    コンテキストの値が変更されると、すべての使用者が再レンダリング
                  </li>
                  <li>
                    Provider外で使用するとエラーが発生（カスタムフックで対処）
                  </li>
                  <li>過度な使用はパフォーマンス問題を引き起こす可能性</li>
                  <li>頻繁に変更される値には適さない場合がある</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CounterProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
