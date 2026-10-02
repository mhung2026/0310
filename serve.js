// Server tĩnh tí hon, không cần cài thêm gì.
//   node serve.js        -> http://localhost:5173
const http = require('http');
const fs   = require('fs');
const path = require('path');
const { quetAnh } = require('./quet-anh');

const PORT = process.env.PORT || 5173;
const ROOT = __dirname;
const TYPES = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8',   '.json':'application/json; charset=utf-8',
  '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml',
  '.mp3':'audio/mpeg', '.woff2':'font/woff2', '.ico':'image/x-icon',
};

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);

  // Danh sách ảnh được quét lại ngay lúc trang hỏi, chứ không đọc file sẵn.
  // Nhờ vậy bỏ thêm ảnh vào thư mục là tải lại trang thấy liền, không phải
  // khởi động lại server. (Trên Vercel thì file này đã được sinh lúc deploy.)
  if (url === '/anh/danhsach.json') {
    res.writeHead(200, { 'Content-Type': TYPES['.json'], 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(quetAnh()));
    return;
  }

  const file = path.join(ROOT, url === '/' ? 'index.html' : url);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('Forbidden'); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}).end('Khong tim thay'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`\n  Mo trinh duyet: http://localhost:${PORT}\n`));
