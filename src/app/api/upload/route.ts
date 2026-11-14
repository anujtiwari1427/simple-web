import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was provided in the request." },
        { status: 400 }
      );
    }

    // Validate size (max 50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File exceeds 50MB size limit." },
        { status: 400 }
      );
    }

    // Format file name
    const originalName = file.name || "resource.pdf";
    const extension = path.extname(originalName) || ".pdf";
    const baseCleanName = path
      .basename(originalName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 50);
    const uniqueFileName = `${baseCleanName}-${Date.now()}${extension}`;

    // Target upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueFileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    // Human readable size
    let formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    if (file.size < 1024 * 1024) {
      formattedSize = `${Math.round(file.size / 1024)} KB`;
    }

    const publicUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: originalName,
      uniqueFileName,
      fileSize: formattedSize,
      sizeBytes: file.size,
      mimeType: file.type || "application/pdf"
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "File upload failed";
    console.error("File upload error:", err);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
