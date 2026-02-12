const btn = document.getElementById('btn');
const urlInput = document.getElementById('url');
const quality = document.getElementById('quality');
const result = document.getElementById('result');

function detectPlatform(url) {
  if (/youtube|youtu\.be/i.test(url)) return 'YouTube';
  if (/facebook|fb\.watch/i.test(url)) return 'Facebook';
  if (/instagram/i.test(url)) return 'Instagram';
  if (/tiktok/i.test(url)) return 'TikTok';
  if (/twitter|x\.com/i.test(url)) return 'X / Twitter';
  if (/bilibili/i.test(url)) return 'Bilibili';
  return 'Tidak dikenal';
}

btn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) {
    result.innerHTML = '<p class="error">Masukkan URL video.</p>';
    return;
  }

  btn.disabled = true;
  result.innerHTML = '<p>Mengambil data…</p>';

  // MOCK hasil (frontend-only)
  await new Promise(r => setTimeout(r, 600));

  const platform = detectPlatform(url);
  result.innerHTML = `
    <p class="ok">Platform: <strong>${platform}</strong></p>
    <ul>
      <li><a href="#">Download ${quality.value} (contoh)</a></li>
      <li><a href="#">Download Audio (contoh)</a></li>
    </ul>
    <p class="notice">Backend diperlukan untuk link download asli.</p>
  `;

  btn.disabled = false;
});
