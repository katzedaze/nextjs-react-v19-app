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
import { Heart, Trash2 } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  liked: boolean;
};

// 模擬的なサーバー処理
async function saveTodo(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // ランダムにエラーを発生させる（20%の確率）
  if (Math.random() < 0.2) {
    throw new Error("Failed to save todo");
  }
}

async function deleteTodo(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

async function toggleLike(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

export default function UseOptimisticPage() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "React v19を学習する", completed: false, liked: false },
    { id: 2, text: "useOptimisticを理解する", completed: false, liked: true },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state: Todo[], newTodo: Todo | { action: string; id: number }) => {
      if ("action" in newTodo) {
        if (newTodo.action === "delete") {
          return state.filter((todo) => todo.id !== newTodo.id);
        } else if (newTodo.action === "toggleLike") {
          return state.map((todo) =>
            todo.id === newTodo.id ? { ...todo, liked: !todo.liked } : todo
          );
        }
      }
      return [...state, newTodo as Todo];
    }
  );

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      liked: false,
    };

    // 楽観的更新
    startTransition(async () => {
      addOptimisticTodo(newTodo);
      setInputValue("");

      try {
        await saveTodo();
        setTodos((prev) => [...prev, newTodo]);
      } catch {
        // エラー時は楽観的更新が自動的に元に戻る
        alert("保存に失敗しました。もう一度お試しください。");
        setInputValue(newTodo.text);
      }
    });
  };

  const handleDelete = (id: number) => {
    startTransition(async () => {
      addOptimisticTodo({ action: "delete", id });
      await deleteTodo();
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    });
  };

  const handleToggleLike = (id: number) => {
    startTransition(async () => {
      addOptimisticTodo({ action: "toggleLike", id });
      await toggleLike();
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, liked: !todo.liked } : todo
        )
      );
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold">useOptimistic Hook</h1>
          <Badge variant="default">v19</Badge>
        </div>
        <p className="text-muted-foreground">
          <code>useOptimistic</code>{" "}
          は、楽観的UI更新を実装するための新しいHookです。
          非同期処理の完了を待たずに即座にUIを更新し、より良いユーザー体験を提供します。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`const [optimisticState, addOptimistic] = useOptimistic(
  actualState,
  (currentState, optimisticValue) => {
    // 楽観的な状態を返す
    return [...currentState, optimisticValue];
  }
);`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>特徴</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>非同期処理中に即座にUIを更新</li>
            <li>エラー時は自動的に元の状態に戻る</li>
            <li>useTransitionと組み合わせて使用</li>
            <li>ユーザー体験の向上に貢献</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>実際のサンプル</CardTitle>
          <CardDescription>
            TODOを追加・削除・いいねして楽観的更新を確認してください（保存に2秒かかり、20%の確率で失敗します）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddTodo} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="新しいTODOを入力..."
              disabled={isPending}
            />
            <Button type="submit" disabled={isPending}>
              追加
            </Button>
          </form>

          <div className="space-y-2">
            {optimisticTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span className={todo.completed ? "line-through" : ""}>
                  {todo.text}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleLike(todo.id)}
                    disabled={isPending}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        todo.liked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(todo.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {isPending && (
            <p className="text-sm text-muted-foreground">保存中...</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>コード例</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`function TodoList({ todos }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, newTodo]
  );

  async function addTodo(formData) {
    const newTodo = {
      id: Date.now(),
      text: formData.get("todo"),
    };

    // 即座にUIを更新
    addOptimisticTodo(newTodo);

    // サーバーに保存
    await saveTodo(newTodo);
  }

  return (
    <form action={addTodo}>
      <input name="todo" />
      <button type="submit">追加</button>
      {optimisticTodos.map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </form>
  );
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
