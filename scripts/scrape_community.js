const fs = require('fs');
const https = require('https');
const path = require('path');

const outputDir = path.join(__dirname, '../public/assets/community');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const imageUrls = [
  "https://northmind.store/cdn/shop/files/1.png?v=1764975378&width=800",
  "https://northmind.store/cdn/shop/files/2.png?v=1764975378&width=800",
  "https://northmind.store/cdn/shop/files/3.png?v=1764975378&width=800",
  "https://northmind.store/cdn/shop/files/4.png?v=1765483312&width=800",
  "https://northmind.store/cdn/shop/files/5.png?v=1764975378&width=800"
];

console.log(`Scraping ${imageUrls.length} images...`);

imageUrls.forEach((url) => {
  const urlObj = new URL(url);
  const filename = path.basename(urlObj.pathname);
  const filepath = path.join(outputDir, filename);

  console.log(`Downloading ${url} to ${filepath}...`);

  https.get(url, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Failed to download ${url}: Status ${res.statusCode}`);
      return;
    }

    const fileStream = fs.createWriteStream(filepath);
    res.pipe(fileStream);

    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Successfully saved ${filename}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${url}: ${err.message}`);
  });
});
