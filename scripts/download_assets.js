
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.join(__dirname, '../src/assets/images');

const TASKS = [
    {
        url: 'https://bramha.work/afk-rewards-for-guild-of-guardians/',
        folder: 'guild'
    },
    {
        url: 'https://bramha.work/rocksmith-mobile/',
        folder: 'rocksmith'
    }
];

function sanitizeFilename(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const file = fs.createWriteStream(filepath);
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            } else {
                // Handle redirects or errors
                if (res.statusCode === 301 || res.statusCode === 302) {
                    downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
                    return;
                }
                reject(new Error(`Status Code: ${res.statusCode}`));
            }
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function scrapeAndDownload() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    for (const task of TASKS) {
        console.log(`Processing ${task.folder}...`);
        await page.goto(task.url, { waitUntil: 'networkidle' });

        // Scrape images with category logic
        const images = await page.evaluate(() => {
            const results = [];
            const imgs = Array.from(document.querySelectorAll('figure img, .gallery img, img'));

            // Helper to find nearest preceding header
            const getCategory = (element) => {
                let current = element;
                const allElements = Array.from(document.querySelectorAll('*'));
                const index = allElements.indexOf(current);

                for (let i = index - 1; i >= 0; i--) {
                    const el = allElements[i];
                    if (['H1', 'H2', 'H3'].includes(el.tagName)) {
                        return el.innerText.trim();
                    }
                }
                return 'Uncategorized';
            };

            imgs.forEach(img => {
                // Filter out small icons or irrelevant images
                if (img.width < 100 || img.height < 100) return;

                const category = getCategory(img);
                // Get high-res link if available in parent anchor
                let src = img.src;
                if (img.parentElement.tagName === 'A' && img.parentElement.href.match(/\.(jpeg|jpg|png|webp)$/i)) {
                    src = img.parentElement.href;
                }

                results.push({
                    src: src,
                    category: category,
                    filename: img.src.split('/').pop().split('?')[0] // Basic filename from URL
                });
            });

            // Deduplicate
            return results.filter((v, i, a) => a.findIndex(t => (t.src === v.src)) === i);
        });

        console.log(`Found ${images.length} images for ${task.folder}.`);

        for (const [index, img] of images.entries()) {
            const safeCategory = sanitizeFilename(img.category || 'uncategorized');
            const folderPath = path.join(TARGET_DIR, task.folder, safeCategory);

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            // Create a sequential filename to keep order but preserve extension
            const ext = path.extname(img.filename) || '.jpg';
            const baseName = sanitizeFilename(path.basename(img.filename, ext));
            const finalName = `${index.toString().padStart(3, '0')}_${baseName}${ext}`;
            const filePath = path.join(folderPath, finalName);

            try {
                console.log(`Downloading ${img.src} to ${task.folder}/${safeCategory}/${finalName}`);
                await downloadImage(img.src, filePath);
            } catch (e) {
                console.error(`Failed to download ${img.src}:`, e.message);
            }
        }
    }

    await browser.close();
}

scrapeAndDownload().catch(console.error);
