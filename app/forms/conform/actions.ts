"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import * as z from "zod";

// コンタクトフォーム用のスキーマ
const contactSchema = z.object({
  name: z.string().min(2, "名前は2文字以上で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  subject: z.string().min(1, "件名は必須です"),
  message: z.string().min(10, "メッセージは10文字以上で入力してください"),
  priority: z.enum(["low", "medium", "high"]),
  category: z.string().min(1, "カテゴリを選択してください"),
});

// ニュースレター登録用のスキーマ
const newsletterSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  name: z.string().min(1, "名前は必須です"),
  interests: z
    .array(z.string())
    .min(1, "少なくとも1つの興味分野を選択してください"),
  frequency: z.enum(["daily", "weekly", "monthly"]),
});

// フィードバック用のスキーマ
const feedbackSchema = z.object({
  rating: z
    .number()
    .min(1, "評価を選択してください")
    .max(5, "評価は5以下である必要があります"),
  feedback: z.string().min(5, "フィードバックは5文字以上で入力してください"),
  recommend: z.boolean(),
  category: z.enum(["bug", "feature", "improvement", "other"]),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
};

export type NewsletterFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
};

export type FeedbackFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
};

// コンタクトフォームのServer Action
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const submission = parseWithZod(formData, {
    schema: contactSchema,
  });

  if (submission.status !== "success") {
    return {
      status: "error",
      message: "入力内容に誤りがあります。",
      errors: submission.error
        ? Object.fromEntries(
            Object.entries(submission.error).map(([key, value]) => [
              key,
              value || [],
            ])
          )
        : {},
    };
  }

  // ここで実際のデータ処理を行う（データベース保存、メール送信など）
  try {
    // シミュレートされた処理時間
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("コンタクトフォーム送信:", submission.value);

    return {
      status: "success",
      message: `${submission.value.name}様、お問い合わせありがとうございます。24時間以内にご返信いたします。`,
    };
  } catch {
    return {
      status: "error",
      message:
        "送信中にエラーが発生しました。しばらくしてから再度お試しください。",
    };
  }
}

// ニュースレター登録のServer Action
export async function submitNewsletterForm(
  _prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const submission = parseWithZod(formData, {
    schema: newsletterSchema,
  });

  if (submission.status !== "success") {
    return {
      status: "error",
      message: "入力内容に誤りがあります。",
      errors: submission.error
        ? Object.fromEntries(
            Object.entries(submission.error).map(([key, value]) => [
              key,
              value || [],
            ])
          )
        : {},
    };
  }

  try {
    // シミュレートされた処理時間
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("ニュースレター登録:", submission.value);

    return {
      status: "success",
      message: `${submission.value.name}様、ニュースレターの登録が完了しました！`,
    };
  } catch {
    return {
      status: "error",
      message:
        "登録中にエラーが発生しました。しばらくしてから再度お試しください。",
    };
  }
}

// フィードバック送信のServer Action
export async function submitFeedbackForm(
  _prevState: FeedbackFormState,
  formData: FormData
): Promise<FeedbackFormState> {
  const submission = parseWithZod(formData, {
    schema: feedbackSchema,
  });

  if (submission.status !== "success") {
    return {
      status: "error",
      message: "入力内容に誤りがあります。",
      errors: submission.error
        ? Object.fromEntries(
            Object.entries(submission.error).map(([key, value]) => [
              key,
              value || [],
            ])
          )
        : {},
    };
  }

  try {
    // シミュレートされた処理時間
    await new Promise((resolve) => setTimeout(resolve, 600));

    console.log("フィードバック送信:", submission.value);

    return {
      status: "success",
      message:
        "フィードバックをありがとうございました！今後の改善に活用させていただきます。",
    };
  } catch {
    return {
      status: "error",
      message:
        "送信中にエラーが発生しました。しばらくしてから再度お試しください。",
    };
  }
}

// リダイレクト付きのServer Action例
export async function submitContactWithRedirect(
  _prevState: ContactFormState,
  formData: FormData
): Promise<never> {
  const submission = parseWithZod(formData, {
    schema: contactSchema,
  });

  if (submission.status !== "success") {
    // エラーがある場合は同じページにリダイレクト
    redirect("/forms/conform?error=validation");
  }

  try {
    // 処理を実行
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("リダイレクト付きコンタクト送信:", submission.value);

    // 成功時は別ページにリダイレクト
    redirect("/forms/conform?success=contact");
  } catch {
    redirect("/forms/conform?error=server");
  }
}
