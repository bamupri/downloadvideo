// File: /api/download.js
// Vercel Serverless Function (Node.js)

import ytdlp from "yt-dlp-exec";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url, quality } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Tentukan format berdasarkan quality
    let format = "best";
    if (quality === "audio") format = "bestaudio";

    // Ambil info video (tanpa download file, hanya URL stream)
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
    });

    const formats = info.formats
      .filter(f => f.url)
      .slice(0, 5)
      .map(f => ({
        label: `${f.ext} ${f.format_note || ""} ${f.resolution || ""}`,
        url: f.url,
      }));

    return res.status(200).json({
      title: info.title,
      platform: info.extractor,
      links: formats,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}