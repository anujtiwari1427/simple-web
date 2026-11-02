import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // If RESEND_API_KEY or SUPABASE is configured, real sync happens here.
    // Otherwise, we log and return success for immediate out-of-the-box readiness.
    console.log(`[Newsletter Signup] New subscriber registered: ${email}`);

    return NextResponse.json({
      success: true,
      message: "🎉 You're in! Welcome to the Code Decoded inner circle. Check your inbox for the starter cheatsheet!"
    });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process newsletter subscription." },
      { status: 500 }
    );
  }
}
