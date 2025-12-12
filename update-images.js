#!/usr/bin/env node

/**
 * Script đơn giản để cập nhật file index.json trong các folder
 * Chạy: node update-images.js
 * Script này sẽ tự động quét folder và tạo file index.json chứa tất cả ảnh
 */

const fs = require('fs');
const path = require('path');

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG', '.GIF', '.WEBP'];

function getImageFiles(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    return files
      .filter(file => {
        const ext = path.extname(file);
        return imageExtensions.includes(ext) && file !== 'index.json';
      })
      .sort();
  } catch (error) {
    console.error(`Lỗi khi đọc folder ${folderPath}:`, error.message);
    return [];
  }
}

// Generate index.json cho album folder
const albumFiles = getImageFiles('album');
fs.writeFileSync('album/index.json', JSON.stringify(albumFiles, null, 2), 'utf8');
console.log(`✓ Đã cập nhật album/index.json (${albumFiles.length} ảnh)`);

// Generate index.json cho img folder
const imgFiles = getImageFiles('img');
fs.writeFileSync('img/index.json', JSON.stringify(imgFiles, null, 2), 'utf8');
console.log(`✓ Đã cập nhật img/index.json (${imgFiles.length} ảnh)`);

console.log('\n✅ Hoàn thành! Các file index.json đã được cập nhật.');
console.log('💡 Khi thêm ảnh mới, chỉ cần chạy lại: node update-images.js');

