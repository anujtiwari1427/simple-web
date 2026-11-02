import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, type, subject, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    console.log(`[Contact Submission] From: ${name} (${email}) Type: ${type} Subject: ${subject}`);
    console.log(`Message: ${message}`);

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! We typically reply within 24-48 hours."
    });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
