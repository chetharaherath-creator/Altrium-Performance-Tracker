async function check() {
  const res = await fetch('https://altrium-performance-tracker.vercel.app');
  const html = await res.text();
  const match = html.match(/<script type="module" crossorigin src="(.*?)">/);
  if (match) {
    const jsRes = await fetch('https://altrium-performance-tracker.vercel.app' + match[1]);
    const js = await jsRes.text();
    const idx = js.indexOf('railway.app');
    console.log('Snippet:', js.substring(idx - 60, idx + 20));
  }
}
check();
