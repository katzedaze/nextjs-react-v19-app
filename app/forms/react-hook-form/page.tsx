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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const basicSchema = z.object({
  name: z.string().min(2, "名前は2文字以上で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  age: z
    .number()
    .min(0, "年齢は0以上で入力してください")
    .max(120, "年齢は120以下で入力してください"),
});

const advancedSchema = z.object({
  firstName: z.string().min(1, "名前は必須です"),
  lastName: z.string().min(1, "姓は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  phone: z.string().optional(),
  country: z.string().min(1, "国を選択してください"),
  bio: z
    .string()
    .max(500, "自己紹介は500文字以内で入力してください")
    .optional(),
  skills: z
    .array(
      z.object({
        name: z.string().min(1, "スキル名は必須です"),
        level: z.enum(["beginner", "intermediate", "advanced"]),
      })
    )
    .min(1, "少なくとも1つのスキルを追加してください"),
  newsletter: z.boolean().default(false),
});

type BasicFormData = z.infer<typeof basicSchema>;
type AdvancedFormData = z.infer<typeof advancedSchema>;

export default function ReactHookFormPage() {
  const basicForm = useForm<BasicFormData>({
    resolver: zodResolver(basicSchema),
    defaultValues: {
      name: "",
      email: "",
      age: 0,
    },
  });

  const advancedForm = useForm({
    resolver: zodResolver(advancedSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      bio: "",
      skills: [{ name: "", level: "beginner" }],
      newsletter: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: advancedForm.control,
    name: "skills",
  });

  const onBasicSubmit = (data: BasicFormData) => {
    alert(`フォームが送信されました:\n${JSON.stringify(data, null, 2)}`);
  };

  const onAdvancedSubmit = (data: AdvancedFormData) => {
    alert(`フォームが送信されました:\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">React Hook Form</h1>
        <p className="text-muted-foreground">
          React Hook
          Formは、パフォーマンスが高く、柔軟性があり、拡張可能なフォームライブラリです。
          最小限の再レンダリングでバリデーション機能を提供します。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { /* デフォルト値 */ }
});

// フォームの送信
const onSubmit = (data) => {
  console.log(data);
};`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">基本フォーム</TabsTrigger>
          <TabsTrigger value="advanced">高度なフォーム</TabsTrigger>
          <TabsTrigger value="controlled">コントロール済み</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>基本的なフォーム</CardTitle>
              <CardDescription>
                useFormとZodバリデーションを使用したシンプルなフォーム
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={basicForm.handleSubmit(onBasicSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="basic-name">名前</Label>
                  <Input
                    id="basic-name"
                    {...basicForm.register("name")}
                    placeholder="名前を入力"
                  />
                  {basicForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {basicForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="basic-email">メールアドレス</Label>
                  <Input
                    id="basic-email"
                    type="email"
                    {...basicForm.register("email")}
                    placeholder="email@example.com"
                  />
                  {basicForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {basicForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="basic-age">年齢</Label>
                  <Input
                    id="basic-age"
                    type="number"
                    {...basicForm.register("age", { valueAsNumber: true })}
                    placeholder="年齢"
                  />
                  {basicForm.formState.errors.age && (
                    <p className="text-sm text-destructive">
                      {basicForm.formState.errors.age.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={basicForm.formState.isSubmitting}
                >
                  {basicForm.formState.isSubmitting ? "送信中..." : "送信"}
                </Button>
              </form>

              <div className="mt-6">
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`const form = useForm({
  resolver: zodResolver(basicSchema),
  defaultValues: { name: "", email: "", age: 0 }
});

<Input {...form.register("name")} />
{form.formState.errors.name && (
  <p>{form.formState.errors.name.message}</p>
)}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>高度なフォーム</CardTitle>
              <CardDescription>
                useFieldArrayとより複雑なバリデーションを使用
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={advancedForm.handleSubmit(onAdvancedSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">名前</Label>
                    <Input
                      id="firstName"
                      {...advancedForm.register("firstName")}
                      placeholder="太郎"
                    />
                    {advancedForm.formState.errors.firstName && (
                      <p className="text-sm text-destructive">
                        {advancedForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">姓</Label>
                    <Input
                      id="lastName"
                      {...advancedForm.register("lastName")}
                      placeholder="田中"
                    />
                    {advancedForm.formState.errors.lastName && (
                      <p className="text-sm text-destructive">
                        {advancedForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adv-email">メールアドレス</Label>
                  <Input
                    id="adv-email"
                    type="email"
                    {...advancedForm.register("email")}
                    placeholder="email@example.com"
                  />
                  {advancedForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {advancedForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">電話番号（任意）</Label>
                  <Input
                    id="phone"
                    {...advancedForm.register("phone")}
                    placeholder="090-1234-5678"
                  />
                </div>

                <div className="space-y-2">
                  <Label>国</Label>
                  <Controller
                    name="country"
                    control={advancedForm.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="国を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="japan">日本</SelectItem>
                          <SelectItem value="usa">アメリカ</SelectItem>
                          <SelectItem value="uk">イギリス</SelectItem>
                          <SelectItem value="other">その他</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {advancedForm.formState.errors.country && (
                    <p className="text-sm text-destructive">
                      {advancedForm.formState.errors.country.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">自己紹介（任意）</Label>
                  <Textarea
                    id="bio"
                    {...advancedForm.register("bio")}
                    placeholder="自己紹介を書いてください..."
                    rows={4}
                  />
                  {advancedForm.formState.errors.bio && (
                    <p className="text-sm text-destructive">
                      {advancedForm.formState.errors.bio.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>スキル</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ name: "", level: "beginner" })}
                    >
                      スキルを追加
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-2">
                        <Input
                          {...advancedForm.register(`skills.${index}.name`)}
                          placeholder="スキル名"
                        />
                      </div>
                      <Controller
                        name={`skills.${index}.level`}
                        control={advancedForm.control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">初級</SelectItem>
                              <SelectItem value="intermediate">中級</SelectItem>
                              <SelectItem value="advanced">上級</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        削除
                      </Button>
                    </div>
                  ))}
                  {advancedForm.formState.errors.skills && (
                    <p className="text-sm text-destructive">
                      {advancedForm.formState.errors.skills.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    name="newsletter"
                    control={advancedForm.control}
                    render={({ field }) => (
                      <Checkbox
                        id="newsletter"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="newsletter">ニュースレターを受け取る</Label>
                </div>

                <Button
                  type="submit"
                  disabled={advancedForm.formState.isSubmitting}
                >
                  {advancedForm.formState.isSubmitting ? "送信中..." : "送信"}
                </Button>
              </form>

              <div className="mt-6">
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: "skills"
});

// Controllerを使用した制御
<Controller
  name="country"
  control={form.control}
  render={({ field }) => (
    <Select onValueChange={field.onChange}>
      {/* SelectのJSX */}
    </Select>
  )}
/>`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controlled">
          <Card>
            <CardHeader>
              <CardTitle>制御されたコンポーネント</CardTitle>
              <CardDescription>
                Controllerを使用した外部ライブラリとの統合
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  React Hook
                  FormのControllerコンポーネントは、react-selectやMaterial-UIなど、
                  標準のHTMLフォーム要素以外のコンポーネントを統合する際に使用します。
                </AlertDescription>
              </Alert>

              <div className="mt-6">
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`import { Controller } from 'react-hook-form';

<Controller
  name="fieldName"
  control={form.control}
  rules={{ required: "This field is required" }}
  render={({ field, fieldState, formState }) => (
    <CustomComponent
      {...field}
      error={fieldState.error}
      // カスタムプロパティ
    />
  )}
/>`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>React Hook Formの主な特徴</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>高いパフォーマンス</strong>: 最小限の再レンダリング
            </li>
            <li>
              <strong>バリデーション</strong>:
              Zodなど複数のバリデーションライブラリに対応
            </li>
            <li>
              <strong>TypeScript対応</strong>: 完全な型安全性
            </li>
            <li>
              <strong>useFieldArray</strong>: 動的な配列フィールドの管理
            </li>
            <li>
              <strong>Controller</strong>: 外部コンポーネントとの統合
            </li>
            <li>
              <strong>DevTools</strong>: 開発時のデバッグサポート
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
