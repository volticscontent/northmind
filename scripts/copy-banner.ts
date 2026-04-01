import * as fs from "fs";

const source = "C:\\Users\\gusta\\.gemini\\antigravity\\brain\\31e33b67-ee02-49ff-b980-e7272294b772\\three_for_one_fragrances_banner_1775077351611.png";
const dest = "d:\\Códigos\\Rafa\\Nathan\\northmind\\public\\collections\\3x1-fragrances-banner.png";

try {
  fs.copyFileSync(source, dest);
  console.log("✅ Image copied successfully!");
} catch (err) {
  console.error("❌ Failed to copy image:", err);
}
