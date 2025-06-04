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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Edit3, Trash2, X } from "lucide-react";
import { useReducer, useState } from "react";

// カウンターの例
type CounterState = {
  count: number;
  step: number;
};

type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" }
  | { type: "setStep"; payload: number };

function counterReducer(
  state: CounterState,
  action: CounterAction
): CounterState {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + state.step };
    case "decrement":
      return { ...state, count: state.count - state.step };
    case "reset":
      return { ...state, count: 0 };
    case "setStep":
      return { ...state, step: action.payload };
    default:
      return state;
  }
}

function CounterExample() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, step: 1 });

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-4xl font-bold mb-4">{state.count}</div>
        <div className="text-sm text-muted-foreground mb-4">
          ステップ: {state.step}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={() => dispatch({ type: "decrement" })}>
          -{state.step}
        </Button>
        <Button onClick={() => dispatch({ type: "reset" })} variant="outline">
          リセット
        </Button>
        <Button onClick={() => dispatch({ type: "increment" })}>
          +{state.step}
        </Button>
      </div>

      <div className="flex gap-2 items-center justify-center">
        <Label htmlFor="step">ステップ:</Label>
        <Input
          id="step"
          type="number"
          value={state.step}
          onChange={(e) =>
            dispatch({
              type: "setStep",
              payload: parseInt(e.target.value) || 1,
            })
          }
          className="w-20"
          min="1"
        />
      </div>
    </div>
  );
}

// TODO管理の例
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type TodoState = {
  todos: Todo[];
  filter: "all" | "active" | "completed";
};

type TodoAction =
  | { type: "addTodo"; payload: string }
  | { type: "toggleTodo"; payload: number }
  | { type: "deleteTodo"; payload: number }
  | { type: "editTodo"; payload: { id: number; text: string } }
  | { type: "setFilter"; payload: "all" | "active" | "completed" }
  | { type: "clearCompleted" };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "addTodo":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false,
          },
        ],
      };
    case "toggleTodo":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case "deleteTodo":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case "editTodo":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        ),
      };
    case "setFilter":
      return {
        ...state,
        filter: action.payload,
      };
    case "clearCompleted":
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };
    default:
      return state;
  }
}

function TodoExample() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [
      { id: 1, text: "React v19を学習する", completed: false },
      { id: 2, text: "useReducerを理解する", completed: true },
    ],
    filter: "all" as const,
  });

  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === "active") return !todo.completed;
    if (state.filter === "completed") return todo.completed;
    return true;
  });

  const addTodo = () => {
    if (newTodo.trim()) {
      dispatch({ type: "addTodo", payload: newTodo });
      setNewTodo("");
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      dispatch({
        type: "editTodo",
        payload: { id: editingId, text: editText },
      });
    }
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const totalTodos = state.todos.length;
  const completedTodos = state.todos.filter((todo) => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="新しいTODOを追加..."
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <Button onClick={addTodo}>追加</Button>
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-sm text-muted-foreground">フィルター:</span>
        {(["all", "active", "completed"] as const).map((filter) => (
          <Button
            key={filter}
            size="sm"
            variant={state.filter === filter ? "default" : "outline"}
            onClick={() => dispatch({ type: "setFilter", payload: filter })}
          >
            {filter === "all"
              ? "すべて"
              : filter === "active"
              ? "未完了"
              : "完了済み"}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-2 p-3 border rounded"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                dispatch({ type: "toggleTodo", payload: todo.id })
              }
            />

            {editingId === todo.id ? (
              <div className="flex-1 flex gap-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  className="flex-1"
                />
                <Button size="sm" onClick={saveEdit}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span
                  className={`flex-1 ${
                    todo.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {todo.text}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => startEdit(todo)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    dispatch({ type: "deleteTodo", payload: todo.id })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex gap-4">
          <span>総数: {totalTodos}</span>
          <span>未完了: {activeTodos}</span>
          <span>完了: {completedTodos}</span>
        </div>
        {completedTodos > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch({ type: "clearCompleted" })}
          >
            完了済みを削除
          </Button>
        )}
      </div>
    </div>
  );
}

// フォーム管理の例
type FormState = {
  name: string;
  email: string;
  age: number;
  interests: string[];
  errors: Record<string, string>;
  isSubmitting: boolean;
};

type FormAction =
  | {
      type: "setField";
      field: keyof FormState;
      value: string | number | string[];
    }
  | { type: "addInterest"; payload: string }
  | { type: "removeInterest"; payload: string }
  | { type: "setError"; field: string; error: string }
  | { type: "clearErrors" }
  | { type: "setSubmitting"; payload: boolean }
  | { type: "reset" };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "setField":
      return { ...state, [action.field]: action.value };
    case "addInterest":
      return {
        ...state,
        interests: [...state.interests, action.payload],
      };
    case "removeInterest":
      return {
        ...state,
        interests: state.interests.filter(
          (interest) => interest !== action.payload
        ),
      };
    case "setError":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case "clearErrors":
      return { ...state, errors: {} };
    case "setSubmitting":
      return { ...state, isSubmitting: action.payload };
    case "reset":
      return {
        name: "",
        email: "",
        age: 0,
        interests: [],
        errors: {},
        isSubmitting: false,
      };
    default:
      return state;
  }
}

function FormExample() {
  const [state, dispatch] = useReducer(formReducer, {
    name: "",
    email: "",
    age: 0,
    interests: [],
    errors: {},
    isSubmitting: false,
  });

  const [newInterest, setNewInterest] = useState("");

  const interestOptions = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
  ];

  const addInterest = (interest: string) => {
    if (interest && !state.interests.includes(interest)) {
      dispatch({ type: "addInterest", payload: interest });
    }
  };

  const validate = (): boolean => {
    dispatch({ type: "clearErrors" });
    let isValid = true;

    if (!state.name.trim()) {
      dispatch({ type: "setError", field: "name", error: "名前は必須です" });
      isValid = false;
    }

    if (!state.email.trim()) {
      dispatch({
        type: "setError",
        field: "email",
        error: "メールアドレスは必須です",
      });
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      dispatch({
        type: "setError",
        field: "email",
        error: "有効なメールアドレスを入力してください",
      });
      isValid = false;
    }

    if (state.age < 0 || state.age > 120) {
      dispatch({
        type: "setError",
        field: "age",
        error: "有効な年齢を入力してください",
      });
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    dispatch({ type: "setSubmitting", payload: true });

    // 模擬的な送信処理
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert("フォームが送信されました！");
    dispatch({ type: "reset" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">名前</Label>
        <Input
          id="name"
          value={state.name}
          onChange={(e) =>
            dispatch({
              type: "setField",
              field: "name",
              value: e.target.value,
            })
          }
          placeholder="山田太郎"
        />
        {state.errors.name && (
          <p className="text-sm text-red-500">{state.errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          type="email"
          value={state.email}
          onChange={(e) =>
            dispatch({
              type: "setField",
              field: "email",
              value: e.target.value,
            })
          }
          placeholder="yamada@example.com"
        />
        {state.errors.email && (
          <p className="text-sm text-red-500">{state.errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">年齢</Label>
        <Input
          id="age"
          type="number"
          value={state.age}
          onChange={(e) =>
            dispatch({
              type: "setField",
              field: "age",
              value: parseInt(e.target.value) || 0,
            })
          }
          min="0"
          max="120"
        />
        {state.errors.age && (
          <p className="text-sm text-red-500">{state.errors.age}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>興味のある技術</Label>
        <div className="flex gap-2">
          <select
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            className="flex-1 p-2 border rounded"
          >
            <option value="">選択してください</option>
            {interestOptions
              .filter((option) => !state.interests.includes(option))
              .map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </select>
          <Button
            type="button"
            onClick={() => {
              if (newInterest) {
                addInterest(newInterest);
                setNewInterest("");
              }
            }}
            disabled={!newInterest}
          >
            追加
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {state.interests.map((interest) => (
            <Badge
              key={interest}
              variant="secondary"
              className="cursor-pointer"
              onClick={() =>
                dispatch({ type: "removeInterest", payload: interest })
              }
            >
              {interest} ×
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={state.isSubmitting}>
          {state.isSubmitting ? "送信中..." : "送信"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => dispatch({ type: "reset" })}
        >
          リセット
        </Button>
      </div>
    </form>
  );
}

export default function UseReducerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">useReducer Hook</h1>
        <p className="text-muted-foreground">
          <code>useReducer</code>{" "}
          は、複雑な状態ロジックを持つコンポーネントで状態管理を行うためのHookです。
          useStateの代替として、より予測可能で保守性の高い状態管理を提供します。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`const [state, dispatch] = useReducer(reducer, initialState);

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// 使用方法
dispatch({ type: 'increment' });`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="counter" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="counter">カウンター</TabsTrigger>
          <TabsTrigger value="todo">TODO管理</TabsTrigger>
          <TabsTrigger value="form">フォーム</TabsTrigger>
        </TabsList>

        <TabsContent value="counter">
          <Card>
            <CardHeader>
              <CardTitle>カウンターの例</CardTitle>
              <CardDescription>
                複数のアクションを持つシンプルなカウンター
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CounterExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" }
  | { type: "setStep"; payload: number };

function counterReducer(state: CounterState, action: CounterAction) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + state.step };
    case "decrement":
      return { ...state, count: state.count - state.step };
    case "reset":
      return { ...state, count: 0 };
    case "setStep":
      return { ...state, step: action.payload };
    default:
      return state;
  }
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="todo">
          <Card>
            <CardHeader>
              <CardTitle>TODO管理の例</CardTitle>
              <CardDescription>
                複雑な状態変更を伴うTODOアプリケーション
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TodoExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`type TodoAction =
  | { type: "addTodo"; payload: string }
  | { type: "toggleTodo"; payload: number }
  | { type: "deleteTodo"; payload: number }
  | { type: "editTodo"; payload: { id: number; text: string } }
  | { type: "setFilter"; payload: "all" | "active" | "completed" };

function todoReducer(state: TodoState, action: TodoAction) {
  switch (action.type) {
    case "addTodo":
      return {
        ...state,
        todos: [...state.todos, { id: Date.now(), text: action.payload, completed: false }],
      };
    case "toggleTodo":
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    // その他のアクション...
  }
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>フォーム管理の例</CardTitle>
              <CardDescription>
                バリデーションと複雑な入力を持つフォーム
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`type FormAction =
  | { type: "setField"; field: keyof FormState; value: any }
  | { type: "addInterest"; payload: string }
  | { type: "setError"; field: string; error: string }
  | { type: "clearErrors" }
  | { type: "reset" };

function formReducer(state: FormState, action: FormAction) {
  switch (action.type) {
    case "setField":
      return { ...state, [action.field]: action.value };
    case "setError":
      return { ...state, errors: { ...state.errors, [action.field]: action.error } };
    case "reset":
      return initialFormState;
    // その他のアクション...
  }
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>useReducerの特徴と使用指針</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>複数の状態値が相互に関連している場合</li>
            <li>状態の更新ロジックが複雑な場合</li>
            <li>テストしやすい純粋関数として状態ロジックを分離したい場合</li>
            <li>Redux パターンに慣れている場合</li>
            <li>状態の更新が予測可能で一貫性を保ちたい場合</li>
            <li>次の状態が前の状態に大きく依存する場合</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
