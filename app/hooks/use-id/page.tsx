"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useId, useState } from "react";

// フォームコンポーネント
function FormExample() {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const addressId = useId();

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={nameId}>名前</Label>
        <Input id={nameId} placeholder="山田太郎" />
      </div>

      <div className="space-y-2">
        <Label htmlFor={emailId}>メールアドレス</Label>
        <Input id={emailId} type="email" placeholder="yamada@example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor={phoneId}>電話番号</Label>
        <Input id={phoneId} type="tel" placeholder="090-1234-5678" />
      </div>

      <div className="space-y-2">
        <Label htmlFor={addressId}>住所</Label>
        <Input id={addressId} placeholder="東京都渋谷区..." />
      </div>

      <div className="p-4 bg-muted rounded text-sm font-mono">
        <p>生成されたID:</p>
        <p>名前: {nameId}</p>
        <p>メール: {emailId}</p>
        <p>電話: {phoneId}</p>
        <p>住所: {addressId}</p>
      </div>
    </form>
  );
}

// 複数の選択肢コンポーネント
function MultipleChoiceExample() {
  const groupId = useId();
  const [selectedValue, setSelectedValue] = useState("");

  const options = [
    { value: "option1", label: "選択肢 1" },
    { value: "option2", label: "選択肢 2" },
    { value: "option3", label: "選択肢 3" },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">アンケート質問</h4>
      <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
        {options.map((option, index) => {
          const optionId = `${groupId}-option-${index}`;
          return (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={optionId} />
              <Label htmlFor={optionId}>{option.label}</Label>
            </div>
          );
        })}
      </RadioGroup>

      <div className="p-4 bg-muted rounded text-sm font-mono">
        <p>グループID: {groupId}</p>
        <p>選択された値: {selectedValue || "未選択"}</p>
      </div>
    </div>
  );
}

// チェックボックスリスト
function CheckboxListExample() {
  const baseId = useId();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const items = ["JavaScript", "TypeScript", "React", "Next.js", "Node.js"];

  const handleCheck = (item: string, checked: boolean) => {
    if (checked) {
      setCheckedItems((prev) => [...prev, item]);
    } else {
      setCheckedItems((prev) => prev.filter((i) => i !== item));
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">好きな技術を選択してください</h4>
      <div className="space-y-2">
        {items.map((item, index) => {
          const itemId = `${baseId}-checkbox-${index}`;
          return (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={itemId}
                checked={checkedItems.includes(item)}
                onCheckedChange={(checked) =>
                  handleCheck(item, checked as boolean)
                }
              />
              <Label htmlFor={itemId}>{item}</Label>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-muted rounded text-sm">
        <p className="font-mono">ベースID: {baseId}</p>
        <p>選択された技術: {checkedItems.join(", ") || "なし"}</p>
      </div>
    </div>
  );
}

// 動的リストコンポーネント
function DynamicListExample() {
  const listId = useId();
  const [items, setItems] = useState(["初期アイテム"]);
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      setItems((prev) => [...prev, newItem]);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="新しいアイテム..."
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <Button onClick={addItem}>追加</Button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => {
          const itemId = `${listId}-item-${index}`;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded"
            >
              <Label htmlFor={itemId} className="flex-1">
                {item}
              </Label>
              <input type="hidden" id={itemId} value={item} />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeItem(index)}
              >
                削除
              </Button>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-muted rounded text-sm font-mono">
        <p>リストベースID: {listId}</p>
        <p>アイテム数: {items.length}</p>
      </div>
    </div>
  );
}

// ネストしたコンポーネント
function NestedComponentExample() {
  const parentId = useId();

  function ChildComponent({
    title,
    prefix,
  }: {
    title: string;
    prefix: string;
  }) {
    const childId = useId();
    const inputId = `${prefix}-${childId}`;

    return (
      <div className="p-4 border rounded">
        <h5 className="font-semibold mb-2">{title}</h5>
        <div className="space-y-2">
          <Label htmlFor={inputId}>入力フィールド</Label>
          <Input id={inputId} placeholder={`${title}の入力...`} />
        </div>
        <div className="mt-2 text-sm font-mono text-muted-foreground">
          子コンポーネントID: {childId}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-mono p-2 bg-muted rounded">
        親コンポーネントID: {parentId}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChildComponent title="子コンポーネント A" prefix={`${parentId}-a`} />
        <ChildComponent title="子コンポーネント B" prefix={`${parentId}-b`} />
      </div>
    </div>
  );
}

export default function UseIdPage() {
  const pageId = useId();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">useId Hook</h1>
        <p className="text-muted-foreground">
          <code>useId</code>{" "}
          は、アクセシビリティ属性に使用する一意のIDを生成するためのHookです。
          サーバーサイドレンダリングでもクライアントと一致するIDを生成します。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`const id = useId();

<Label htmlFor={id}>ラベル</Label>
<Input id={id} />

// 複数の要素で使用する場合
const baseId = useId();
<Label htmlFor={\`\${baseId}-email\`}>メール</Label>
<Input id={\`\${baseId}-email\`} />`}</code>
          </pre>
        </CardContent>
      </Card>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm">
          <strong>このページのID:</strong>{" "}
          <code className="font-mono">{pageId}</code>
        </p>
      </div>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="form">フォーム</TabsTrigger>
          <TabsTrigger value="radio">ラジオ</TabsTrigger>
          <TabsTrigger value="checkbox">チェックボックス</TabsTrigger>
          <TabsTrigger value="dynamic">動的リスト</TabsTrigger>
          <TabsTrigger value="nested">ネスト</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>フォーム要素でのID使用</CardTitle>
              <CardDescription>
                ラベルと入力フィールドを正しく関連付け
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`function FormExample() {
  const nameId = useId();
  const emailId = useId();

  return (
    <form>
      <Label htmlFor={nameId}>名前</Label>
      <Input id={nameId} />

      <Label htmlFor={emailId}>メール</Label>
      <Input id={emailId} />
    </form>
  );
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radio">
          <Card>
            <CardHeader>
              <CardTitle>ラジオボタングループ</CardTitle>
              <CardDescription>同一グループ内で一意なIDを生成</CardDescription>
            </CardHeader>
            <CardContent>
              <MultipleChoiceExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`function MultipleChoice() {
  const groupId = useId();

  return (
    <RadioGroup>
      {options.map((option, index) => {
        const optionId = \`\${groupId}-option-\${index}\`;
        return (
          <div key={option.value}>
            <RadioGroupItem value={option.value} id={optionId} />
            <Label htmlFor={optionId}>{option.label}</Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkbox">
          <Card>
            <CardHeader>
              <CardTitle>チェックボックスリスト</CardTitle>
              <CardDescription>複数選択可能なアイテムリスト</CardDescription>
            </CardHeader>
            <CardContent>
              <CheckboxListExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`function CheckboxList() {
  const baseId = useId();

  return (
    <div>
      {items.map((item, index) => {
        const itemId = \`\${baseId}-checkbox-\${index}\`;
        return (
          <div key={item}>
            <Checkbox id={itemId} />
            <Label htmlFor={itemId}>{item}</Label>
          </div>
        );
      })}
    </div>
  );
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dynamic">
          <Card>
            <CardHeader>
              <CardTitle>動的リスト</CardTitle>
              <CardDescription>
                アイテムの追加・削除でもIDの一意性を保持
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicListExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`function DynamicList() {
  const listId = useId();
  const [items, setItems] = useState([]);

  return (
    <div>
      {items.map((item, index) => {
        const itemId = \`\${listId}-item-\${index}\`;
        return (
          <div key={index}>
            <Label htmlFor={itemId}>{item}</Label>
            <input type="hidden" id={itemId} value={item} />
          </div>
        );
      })}
    </div>
  );
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nested">
          <Card>
            <CardHeader>
              <CardTitle>ネストしたコンポーネント</CardTitle>
              <CardDescription>階層構造でのID管理</CardDescription>
            </CardHeader>
            <CardContent>
              <NestedComponentExample />
              <pre className="bg-muted p-4 rounded-lg text-sm mt-4">
                <code>{`function Parent() {
  const parentId = useId();

  function Child({ prefix }) {
    const childId = useId();
    const inputId = \`\${prefix}-\${childId}\`;

    return (
      <div>
        <Label htmlFor={inputId}>入力</Label>
        <Input id={inputId} />
      </div>
    );
  }

  return (
    <div>
      <Child prefix={\`\${parentId}-a\`} />
      <Child prefix={\`\${parentId}-b\`} />
    </div>
  );
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>useIdの特徴と注意点</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>
              サーバーサイドレンダリングでもハイドレーション時に一致するIDを生成
            </li>
            <li>アクセシビリティ属性（htmlFor、aria-describedby等）に使用</li>
            <li>CSSセレクターのためのIDとしては使用しない</li>
            <li>
              キーとしても使用しない（配列インデックスや一意のデータIDを使用）
            </li>
            <li>同一コンポーネントの複数インスタンスでも一意性を保証</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
