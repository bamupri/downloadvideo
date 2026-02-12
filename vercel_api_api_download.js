// File: /api/download.js
// Auto download (force attachment)

import ytdlp from "yt-dlp-exec";
import https from "https";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url, quality } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    let format = "best";
    if (quality === "audio") format = "bestaudio";

    // Ambil metadata & URL stream terbaik
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      format,
      noWarnings: true,
      preferFreeFormats: true
    });

    const stream = info.formats.find(f => f.url);
    if (!stream) throw new Error("Stream tidak ditemukan");

    const filename = `${info.title.replace(/[^a-z0-9]/gi, '_')}.${stream.ext || 'mp4'}`;

    res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);
    res.setHeader("Content-Type", "application/octet-stream");

    https.get(stream.url, videoRes => {
      videoRes.pipe(res);
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
