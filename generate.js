const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    try {
        // Lanzamos el navegador virtual
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Cargamos los datos de tus frases
        const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

        // Procesamos cada frase una por una
        for (const item of data) {
            const htmlContent = fs.readFileSync('./template.html', 'utf8');
            await page.setContent(htmlContent);
            
            // Inyectamos la información en el diseño
            await page.evaluate((item) => {
                document.getElementById('post-id').innerText = item.id;
                document.getElementById('post-title').innerHTML = item.titulo;
                document.getElementById('post-footer').innerHTML = item.conclusion;
                document.getElementById('post-diagram').innerHTML = `<svg viewBox="0 0 100 100">${item.diagrama}</svg>`;
                document.documentElement.style.setProperty('--accent', item.color);
            }, item);

            // Ajustamos el tamaño para Instagram
            await page.setViewport({ width: 1080, height: 1350 });
            
            // Creamos la carpeta de salida si no existe
            if (!fs.existsSync('./output')) fs.mkdirSync('./output');
            
            // Tomamos la foto
            await page.screenshot({ path: `./output/post-${item.id.replace('#','')}.png` });
            console.log(`¡Post ${item.id} creado con éxito!`);
        }
        await browser.close();
    } catch (error) {
        console.error("Hubo un error en el robot:", error);
        process.exit(1);
    }
})();
