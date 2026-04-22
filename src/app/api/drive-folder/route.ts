import { NextResponse } from "next/server";

function extractFolderId(input: string): string | null {
  // https://drive.google.com/drive/folders/FOLDER_ID
  // https://drive.google.com/drive/folders/FOLDER_ID?usp=sharing
  const match1 = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (match1) return match1[1];
  // https://drive.google.com/open?id=FOLDER_ID
  const match2 = input.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2) return match2[1];
  // Raw folder ID passed directly
  if (/^[a-zA-Z0-9_-]{10,}$/.test(input.trim())) return input.trim();
  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url") || "";

  if (!url) return NextResponse.json({ files: [] });

  const folderId = extractFolderId(url);
  if (!folderId) {
    return NextResponse.json({ error: "Không nhận ra link Google Drive. Hãy dùng link chia sẻ thư mục." }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chưa có GOOGLE_DRIVE_API_KEY trong .env — xem hướng dẫn bên dưới." },
      { status: 500 }
    );
  }

  try {
    const q = encodeURIComponent(`'${folderId}' in parents and mimeType contains 'image/' and trashed = false`);
    const fields = encodeURIComponent("files(id,name,mimeType)");
    const driveUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&key=${apiKey}&fields=${fields}&pageSize=200&orderBy=name`;

    const res = await fetch(driveUrl, { next: { revalidate: 300 } });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = (err as { error?: { message?: string } }).error?.message || `Drive API trả về ${res.status}`;
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    const data = await res.json() as { files?: { id: string; name: string }[] };
    const files = (data.files || []).map((f) => ({
      id: f.id,
      name: f.name,
      // High-res thumbnail served directly by Google (works for publicly shared files)
      url: `https://drive.google.com/thumbnail?id=${f.id}&sz=w1200`,
    }));

    return NextResponse.json({ files });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
