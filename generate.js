const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

  for (const item of data) {
    // Aquí cargamos el HTML y le inyectamos los datos del JSON
    await page.goto(`file://${process.cwd()}/template.html`);
    await page.evaluate((item) => {
        document.getElementById('post-id').innerText = item.id;
        document.getElementById('post-title').innerHTML = item.titulo;
        document.getElementById('post-footer').innerHTML = item.conclusion;
        document.getElementById('post-diagram').innerHTML = `<svg viewBox="0 0 100 100">${item.diagrama}</svg>`;
        document.documentElement.style.setProperty('--accent', item.color);
    }, item);

    await page.setViewport({ width: 1080, height: 1350 }); // Formato Instagram
    await page.screenshot({ path: `./output/post-${item.id.replace('#','')}.png` });
  }
  await browser.close();
})();
