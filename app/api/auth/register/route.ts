import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const users = [
  {
    id: "1",
    email: "admin@example.com",
    password: "password123", // プレーンテキスト
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "user@example.com",
    password: "password123", // プレーンテキスト
    name: "Regular User",
    role: "user",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "すべてのフィールドを入力してください" },
        { status: 400 }
      );
    }

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: "このメールアドレスは既に使用されています" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: String(users.length + 1),
      email,
      password: hashedPassword,
      name,
      role: "user",
    };

    users.push(newUser);

    return NextResponse.json(
      {
        message: "アカウントが作成されました",
        user: { id: newUser.id, email: newUser.email, name: newUser.name },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
