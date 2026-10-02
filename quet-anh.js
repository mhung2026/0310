// Quét thư mục "anh/" rồi ghi ra "anh/danhsach.json", để trang web biết có
// những tấm nào mà không cần khai báo tay trong index.html.
//
//   node quet-anh.js
//
// Bình thường bạn không phải gõ lệnh này:
//   - chạy "node serve.js" ở máy nhà thì danh sách được quét lại ngay mỗi
//     lần trang hỏi, bỏ thêm ảnh vào là thấy liền, khỏi khởi động lại;
//   - đẩy lên Vercel thì lệnh này chạy lúc deploy (xem vercel.json).
// Cứ bỏ ảnh vào thư mục rồi commit là xong.

const fs   = require('fs');
const path = require('path');

const THU_MUC = path.join(__dirname, 'anh');
const DUOI = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

// "2.jpg" phải đứng trước "10.jpg", nên so sánh kiểu tự nhiên — số ra số,
// chứ xếp theo bảng chữ cái thì "10" lại chen lên trước "2".
const sapXep = (a, b) =>
  a.localeCompare(b, 'vi', { numeric: true, sensitivity: 'base' });

function quetAnh(){
  let ten;
  try {
    ten = fs.readdirSync(THU_MUC);
  } catch {
    return [];                 // chưa có thư mục thì coi như chưa có ảnh
  }
  return ten.filter(t => DUOI.has(path.extname(t).toLowerCase())).sort(sapXep);
}

module.exports = { quetAnh };

// chỉ ghi file khi gọi thẳng "node quet-anh.js", không ghi khi serve.js nạp vào
if (require.main === module) {
  const ds = quetAnh();
  fs.mkdirSync(THU_MUC, { recursive: true });
  fs.writeFileSync(path.join(THU_MUC, 'danhsach.json'),
                   JSON.stringify(ds, null, 2) + '\n');
  console.log(`Da ghi anh/danhsach.json - ${ds.length} tam anh.`);
}
