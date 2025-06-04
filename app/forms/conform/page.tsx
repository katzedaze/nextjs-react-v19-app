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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  getFormProps,
  getInputProps,
  getSelectProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import * as z from "zod";
import {
  submitContactForm,
  submitFeedbackForm,
  submitNewsletterForm,
  type ContactFormState,
  type FeedbackFormState,
  type NewsletterFormState,
} from "./actions";

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
  newsletter: z.boolean().default(false),
});

const contactSchema = z.object({
  subject: z.string().min(1, "件名は必須です"),
  message: z.string().min(10, "メッセージは10文字以上で入力してください"),
  priority: z.enum(["low", "medium", "high"]),
  attachments: z.boolean().default(false),
});

// Server Actions用のスキーマ
const serverContactSchema = z.object({
  name: z.string().min(2, "名前は2文字以上で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  subject: z.string().min(1, "件名は必須です"),
  message: z.string().min(10, "メッセージは10文字以上で入力してください"),
  priority: z.enum(["low", "medium", "high"]),
  category: z.string().min(1, "カテゴリを選択してください"),
});

const newsletterSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  name: z.string().min(1, "名前は必須です"),
  interests: z
    .array(z.string())
    .min(1, "少なくとも1つの興味分野を選択してください"),
  frequency: z.enum(["daily", "weekly", "monthly"]),
});

const feedbackSchema = z.object({
  rating: z
    .number()
    .min(1, "評価を選択してください")
    .max(5, "評価は5以下である必要があります"),
  feedback: z.string().min(5, "フィードバックは5文字以上で入力してください"),
  recommend: z.boolean(),
  category: z.enum(["bug", "feature", "improvement", "other"]),
});

export default function ConformPage() {
  // クライアントサイドフォーム
  const [basicForm, basicFields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: basicSchema });
    },
    onSubmit(event, { submission }) {
      event.preventDefault();
      if (submission?.status === "success") {
        alert(
          `フォームが送信されました:\n${JSON.stringify(
            submission.value,
            null,
            2
          )}`
        );
      }
    },
  });

  const [advancedForm, advancedFields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: advancedSchema });
    },
    onSubmit(event, { submission }) {
      event.preventDefault();
      if (submission?.status === "success") {
        alert(
          `フォームが送信されました:\n${JSON.stringify(
            submission.value,
            null,
            2
          )}`
        );
      }
    },
  });

  const [contactForm, contactFields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: contactSchema });
    },
    onSubmit(event, { submission }) {
      event.preventDefault();
      if (submission?.status === "success") {
        alert(
          `お問い合わせが送信されました:\n${JSON.stringify(
            submission.value,
            null,
            2
          )}`
        );
      }
    },
  });

  // Server Actions (useActionState)
  const [contactState, contactAction, contactPending] = useActionState<
    ContactFormState,
    FormData
  >(submitContactForm, { status: "idle" });

  const [newsletterState, newsletterAction, newsletterPending] = useActionState<
    NewsletterFormState,
    FormData
  >(submitNewsletterForm, { status: "idle" });

  const [feedbackState, feedbackAction, feedbackPending] = useActionState<
    FeedbackFormState,
    FormData
  >(submitFeedbackForm, { status: "idle" });

  // Server Actions用のフォーム設定
  const [serverContactForm, serverContactFields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: serverContactSchema });
    },
  });

  const [serverNewsletterForm, serverNewsletterFields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: newsletterSchema });
    },
  });

  const [serverFeedbackForm, serverFeedbackFields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: feedbackSchema });
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Conform</h1>
        <p className="text-muted-foreground">
          Conformは、Web標準に基づいたプログレッシブエンハンスメント指向のフォームライブラリです。
          サーバーサイドレンダリングとクライアントサイドバリデーションの両方をサポートします。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本的な使い方</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`import { useForm, getFormProps, getInputProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';

const [form, fields] = useForm({
  onValidate({ formData }) {
    return parseWithZod(formData, { schema });
  },
  onSubmit(event, { submission }) {
    // フォーム送信処理
  },
});`}</code>
          </pre>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">基本フォーム</TabsTrigger>
          <TabsTrigger value="advanced">高度なフォーム</TabsTrigger>
          <TabsTrigger value="contact">お問い合わせ</TabsTrigger>
          <TabsTrigger value="server-actions">Server Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>基本的なフォーム</CardTitle>
              <CardDescription>
                ConformとZodバリデーションを使用したシンプルなフォーム
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form {...getFormProps(basicForm)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={basicFields.name.id}>名前</Label>
                    <Input
                      {...getInputProps(basicFields.name, { type: "text" })}
                      placeholder="名前を入力"
                    />
                    {basicFields.name.errors && (
                      <p className="text-sm text-destructive">
                        {basicFields.name.errors}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={basicFields.email.id}>メールアドレス</Label>
                    <Input
                      {...getInputProps(basicFields.email, { type: "email" })}
                      placeholder="email@example.com"
                    />
                    {basicFields.email.errors && (
                      <p className="text-sm text-destructive">
                        {basicFields.email.errors}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={basicFields.age.id}>年齢</Label>
                    <Input
                      {...getInputProps(basicFields.age, { type: "number" })}
                      placeholder="年齢"
                    />
                    {basicFields.age.errors && (
                      <p className="text-sm text-destructive">
                        {basicFields.age.errors}
                      </p>
                    )}
                  </div>

                  <Button type="submit">送信</Button>
                </div>
              </form>

              <div className="mt-6">
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`const [form, fields] = useForm({
  onValidate({ formData }) {
    return parseWithZod(formData, { schema: basicSchema });
  }
});

<form {...getFormProps(form)}>
  <Input {...getInputProps(fields.name, { type: 'text' })} />
  {fields.name.errors && <p>{fields.name.errors}</p>}
</form>`}</code>
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
                複数のフィールドタイプとバリデーションを使用
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form {...getFormProps(advancedForm)}>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={advancedFields.firstName.id}>名前</Label>
                      <Input
                        {...getInputProps(advancedFields.firstName, {
                          type: "text",
                        })}
                        placeholder="太郎"
                      />
                      {advancedFields.firstName.errors && (
                        <p className="text-sm text-destructive">
                          {advancedFields.firstName.errors}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={advancedFields.lastName.id}>姓</Label>
                      <Input
                        {...getInputProps(advancedFields.lastName, {
                          type: "text",
                        })}
                        placeholder="田中"
                      />
                      {advancedFields.lastName.errors && (
                        <p className="text-sm text-destructive">
                          {advancedFields.lastName.errors}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={advancedFields.email.id}>
                      メールアドレス
                    </Label>
                    <Input
                      {...getInputProps(advancedFields.email, {
                        type: "email",
                      })}
                      placeholder="email@example.com"
                    />
                    {advancedFields.email.errors && (
                      <p className="text-sm text-destructive">
                        {advancedFields.email.errors}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={advancedFields.phone.id}>
                      電話番号（任意）
                    </Label>
                    <Input
                      {...getInputProps(advancedFields.phone, { type: "text" })}
                      placeholder="090-1234-5678"
                    />
                    {advancedFields.phone.errors && (
                      <p className="text-sm text-destructive">
                        {advancedFields.phone.errors}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={advancedFields.country.id}>国</Label>
                    <select
                      {...getSelectProps(advancedFields.country)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">国を選択</option>
                      <option value="japan">日本</option>
                      <option value="usa">アメリカ</option>
                      <option value="uk">イギリス</option>
                      <option value="other">その他</option>
                    </select>
                    {advancedFields.country.errors && (
                      <p className="text-sm text-destructive">
                        {advancedFields.country.errors}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={advancedFields.bio.id}>
                      自己紹介（任意）
                    </Label>
                    <Textarea
                      {...getTextareaProps(advancedFields.bio)}
                      placeholder="自己紹介を書いてください..."
                      rows={4}
                    />
                    {advancedFields.bio.errors && (
                      <p className="text-sm text-destructive">
                        {advancedFields.bio.errors}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      {...getInputProps(advancedFields.newsletter, {
                        type: "checkbox",
                      })}
                      className="h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-primary"
                    />
                    <Label htmlFor={advancedFields.newsletter.id}>
                      ニュースレターを受け取る
                    </Label>
                  </div>

                  <Button type="submit">送信</Button>
                </div>
              </form>

              <div className="mt-6">
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`// セレクトボックス
<select {...getSelectProps(fields.country)}>
  <option value="japan">日本</option>
</select>

// テキストエリア
<Textarea {...getTextareaProps(fields.bio)} />

// チェックボックス
<input {...getInputProps(fields.newsletter, { type: 'checkbox' })} />`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>お問い合わせフォーム</CardTitle>
              <CardDescription>
                実用的なお問い合わせフォームの例
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form {...getFormProps(contactForm)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={contactFields.subject.id}>件名</Label>
                    <Input
                      {...getInputProps(contactFields.subject, {
                        type: "text",
                      })}
                      placeholder="お問い合わせの件名"
                    />
                    {contactFields.subject.errors && (
                      <p className="text-sm text-destructive">
                        {contactFields.subject.errors}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={contactFields.message.id}>メッセージ</Label>
                    <Textarea
                      {...getTextareaProps(contactFields.message)}
                      placeholder="お問い合わせ内容を詳しくお書きください..."
                      rows={6}
                    />
                    {contactFields.message.errors && (
                      <p className="text-sm text-destructive">
                        {contactFields.message.errors}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={contactFields.priority.id}>優先度</Label>
                    <select
                      {...getSelectProps(contactFields.priority)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="low">低</option>
                      <option value="medium">中</option>
                      <option value="high">高</option>
                    </select>
                    {contactFields.priority.errors && (
                      <p className="text-sm text-destructive">
                        {contactFields.priority.errors}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      {...getInputProps(contactFields.attachments, {
                        type: "checkbox",
                      })}
                      className="h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-primary"
                    />
                    <Label htmlFor={contactFields.attachments.id}>
                      添付ファイルがあります
                    </Label>
                  </div>

                  <Button type="submit" className="w-full">
                    お問い合わせを送信
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <pre className="bg-muted p-4 rounded-lg text-sm">
                  <code>{`// Conformの特徴：プログレッシブエンハンスメント
// JavaScriptが無効でもHTMLのみで動作する

<form method="POST" action="/contact">
  <input name="subject" required />
  <textarea name="message" required minLength="10" />
  <select name="priority">
    <option value="low">低</option>
  </select>
  <button type="submit">送信</button>
</form>`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="server-actions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Server Actions + useActionState</CardTitle>
                <CardDescription>
                  ConformとReact 19のuseActionStateを組み合わせたSSRフォーム
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                  {/* コンタクトフォーム */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      お問い合わせフォーム
                    </h3>

                    {contactState.status === "success" && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800">{contactState.message}</p>
                      </div>
                    )}

                    {contactState.status === "error" && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">{contactState.message}</p>
                      </div>
                    )}

                    <form
                      action={contactAction}
                      {...getFormProps(serverContactForm)}
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={serverContactFields.name.id}>
                            名前
                          </Label>
                          <Input
                            {...getInputProps(serverContactFields.name, {
                              type: "text",
                            })}
                            placeholder="お名前"
                          />
                          {serverContactFields.name.errors && (
                            <p className="text-sm text-destructive">
                              {serverContactFields.name.errors}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={serverContactFields.email.id}>
                            メールアドレス
                          </Label>
                          <Input
                            {...getInputProps(serverContactFields.email, {
                              type: "email",
                            })}
                            placeholder="email@example.com"
                          />
                          {serverContactFields.email.errors && (
                            <p className="text-sm text-destructive">
                              {serverContactFields.email.errors}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={serverContactFields.subject.id}>
                            件名
                          </Label>
                          <Input
                            {...getInputProps(serverContactFields.subject, {
                              type: "text",
                            })}
                            placeholder="お問い合わせの件名"
                          />
                          {serverContactFields.subject.errors && (
                            <p className="text-sm text-destructive">
                              {serverContactFields.subject.errors}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={serverContactFields.category.id}>
                            カテゴリ
                          </Label>
                          <select
                            {...getSelectProps(serverContactFields.category)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="">カテゴリを選択</option>
                            <option value="general">
                              一般的なお問い合わせ
                            </option>
                            <option value="technical">技術的な問題</option>
                            <option value="billing">請求について</option>
                            <option value="other">その他</option>
                          </select>
                          {serverContactFields.category.errors && (
                            <p className="text-sm text-destructive">
                              {serverContactFields.category.errors}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={serverContactFields.priority.id}>
                            優先度
                          </Label>
                          <select
                            {...getSelectProps(serverContactFields.priority)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="low">低</option>
                            <option value="medium">中</option>
                            <option value="high">高</option>
                          </select>
                          {serverContactFields.priority.errors && (
                            <p className="text-sm text-destructive">
                              {serverContactFields.priority.errors}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={serverContactFields.message.id}>
                            メッセージ
                          </Label>
                          <Textarea
                            {...getTextareaProps(serverContactFields.message)}
                            placeholder="お問い合わせ内容を詳しくお書きください..."
                            rows={4}
                          />
                          {serverContactFields.message.errors && (
                            <p className="text-sm text-destructive">
                              {serverContactFields.message.errors}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={contactPending}
                          className="w-full"
                        >
                          {contactPending ? "送信中..." : "送信"}
                        </Button>
                      </div>
                    </form>
                  </div>

                  {/* ニュースレター登録フォーム */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      ニュースレター登録
                    </h3>

                    {newsletterState.status === "success" && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800">
                          {newsletterState.message}
                        </p>
                      </div>
                    )}

                    {newsletterState.status === "error" && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">
                          {newsletterState.message}
                        </p>
                      </div>
                    )}

                    <form
                      action={newsletterAction}
                      {...getFormProps(serverNewsletterForm)}
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={serverNewsletterFields.name.id}>
                            名前
                          </Label>
                          <Input
                            {...getInputProps(serverNewsletterFields.name, {
                              type: "text",
                            })}
                            placeholder="お名前"
                          />
                          {serverNewsletterFields.name.errors && (
                            <p className="text-sm text-destructive">
                              {serverNewsletterFields.name.errors}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={serverNewsletterFields.email.id}>
                            メールアドレス
                          </Label>
                          <Input
                            {...getInputProps(serverNewsletterFields.email, {
                              type: "email",
                            })}
                            placeholder="email@example.com"
                          />
                          {serverNewsletterFields.email.errors && (
                            <p className="text-sm text-destructive">
                              {serverNewsletterFields.email.errors}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={serverNewsletterFields.frequency.id}>
                            配信頻度
                          </Label>
                          <select
                            {...getSelectProps(
                              serverNewsletterFields.frequency
                            )}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="daily">毎日</option>
                            <option value="weekly">週1回</option>
                            <option value="monthly">月1回</option>
                          </select>
                          {serverNewsletterFields.frequency.errors && (
                            <p className="text-sm text-destructive">
                              {serverNewsletterFields.frequency.errors}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>興味のある分野</Label>
                          <div className="space-y-2">
                            {[
                              "technology",
                              "design",
                              "business",
                              "lifestyle",
                            ].map((interest) => (
                              <div
                                key={interest}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  name="interests"
                                  value={interest}
                                  className="h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-primary"
                                />
                                <Label className="text-sm font-normal">
                                  {interest === "technology" && "テクノロジー"}
                                  {interest === "design" && "デザイン"}
                                  {interest === "business" && "ビジネス"}
                                  {interest === "lifestyle" && "ライフスタイル"}
                                </Label>
                              </div>
                            ))}
                          </div>
                          {serverNewsletterFields.interests.errors && (
                            <p className="text-sm text-destructive">
                              {serverNewsletterFields.interests.errors}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={newsletterPending}
                          className="w-full"
                        >
                          {newsletterPending ? "登録中..." : "登録"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    フィードバックフォーム
                  </h3>

                  {feedbackState.status === "success" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                      <p className="text-green-800">{feedbackState.message}</p>
                    </div>
                  )}

                  {feedbackState.status === "error" && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                      <p className="text-red-800">{feedbackState.message}</p>
                    </div>
                  )}

                  <form
                    action={feedbackAction}
                    {...getFormProps(serverFeedbackForm)}
                    className="max-w-md"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>評価 (1-5)</Label>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <label
                              key={rating}
                              className="flex items-center space-x-1"
                            >
                              <input
                                type="radio"
                                name="rating"
                                value={rating}
                                className="h-4 w-4"
                              />
                              <span>{rating}</span>
                            </label>
                          ))}
                        </div>
                        {serverFeedbackFields.rating.errors && (
                          <p className="text-sm text-destructive">
                            {serverFeedbackFields.rating.errors}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={serverFeedbackFields.category.id}>
                          カテゴリ
                        </Label>
                        <select
                          {...getSelectProps(serverFeedbackFields.category)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="bug">バグ報告</option>
                          <option value="feature">機能要望</option>
                          <option value="improvement">改善提案</option>
                          <option value="other">その他</option>
                        </select>
                        {serverFeedbackFields.category.errors && (
                          <p className="text-sm text-destructive">
                            {serverFeedbackFields.category.errors}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={serverFeedbackFields.feedback.id}>
                          フィードバック
                        </Label>
                        <Textarea
                          {...getTextareaProps(serverFeedbackFields.feedback)}
                          placeholder="フィードバックをお聞かせください..."
                          rows={4}
                        />
                        {serverFeedbackFields.feedback.errors && (
                          <p className="text-sm text-destructive">
                            {serverFeedbackFields.feedback.errors}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          {...getInputProps(serverFeedbackFields.recommend, {
                            type: "checkbox",
                          })}
                          className="h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-primary"
                        />
                        <Label htmlFor={serverFeedbackFields.recommend.id}>
                          このサービスを他の人におすすめしますか？
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        disabled={feedbackPending}
                        className="w-full"
                      >
                        {feedbackPending ? "送信中..." : "フィードバックを送信"}
                      </Button>
                    </div>
                  </form>
                </div>

                <div className="mt-8">
                  <pre className="bg-muted p-4 rounded-lg text-sm">
                    <code>{`// Server Actions + useActionState + Conform

// 1. Server Actionを定義
"use server";
export async function submitForm(prevState, formData) {
  const submission = parseWithZod(formData, { schema });
  if (submission.status !== "success") {
    return { status: "error", errors: submission.error };
  }
  // データ処理
  return { status: "success", message: "送信完了" };
}

// 2. useActionStateで状態管理
const [state, action, pending] = useActionState(submitForm, { status: "idle" });

// 3. ConformでフォームとServer Actionを連携
const [form, fields] = useForm({
  lastResult: state,  // Server Actionの結果をConformに連携
  onValidate({ formData }) {
    return parseWithZod(formData, { schema });
  },
});

// 4. フォームでServer Actionを使用
<form action={action} {...getFormProps(form)}>
  <Input {...getInputProps(fields.name, { type: 'text' })} />
  <Button type="submit" disabled={pending}>
    {pending ? "送信中..." : "送信"}
  </Button>
</form>`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Conformの主な特徴</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>プログレッシブエンハンスメント</strong>:
              JavaScriptが無効でも動作
            </li>
            <li>
              <strong>Web標準準拠</strong>: HTML標準のフォーム機能を活用
            </li>
            <li>
              <strong>TypeScript対応</strong>: 完全な型安全性
            </li>
            <li>
              <strong>getInputProps</strong>: 型安全なinput属性の管理
            </li>
            <li>
              <strong>サーバーサイド統合</strong>: Next.jsのServer
              Actionsとの親和性
            </li>
            <li>
              <strong>最小限のJavaScript</strong>: パフォーマンス重視の設計
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
