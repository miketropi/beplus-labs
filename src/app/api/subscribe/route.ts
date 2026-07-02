import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const listId = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID;
  if (!listId) {
    return NextResponse.json({ error: "List ID not configured" }, { status: 500 });
  }

  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const body = new URLSearchParams({ g: listId, email });
    const res = await fetch(
      "https://manage.kmail-lists.com/subscriptions/subscribe",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Klaviyo error:", text);
      return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
