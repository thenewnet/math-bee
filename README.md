# 🐝 Math Bee — Bé Vui Học Toán

Ứng dụng **làm quen toán cho trẻ mầm non đến tiền tiểu học**, giao diện hiện đại,
thân thiện, thao tác đơn giản. Chạy trên nền web và **cài đặt được như app**
trên điện thoại / máy tính bảng (PWA).

> Giáo trình bám khung **"Làm quen với một số khái niệm sơ đẳng về toán"**
> trong Chương trình Giáo dục Mầm non, tập trung giai đoạn **5–6 tuổi / tiền tiểu học**.
> Xem chi tiết cơ sở học thuật tại [`docs/GIAO-TRINH.md`](docs/GIAO-TRINH.md).

## ✨ Tính năng

- **Hồ sơ nhiều bé**: mỗi bé có tên, nhân vật và độ tuổi riêng; tiến độ lưu tách biệt.
- **Lộ trình 19 chặng** tăng dần độ khó, mở khóa tuần tự (bài trước xong mới mở bài sau).
- **21 dạng bài tương tác**: đếm (tới 20), nhận biết chữ số, so sánh nhiều/ít, số thứ tự,
  số liền trước–liền sau, đếm cách 2/5, đếm lùi, quy luật, hình học 2D/3D, phương hướng,
  so sánh kích thước, gộp–tách, cộng, trừ trong phạm vi 10 và học cụ Montessori…
- **Giọng đọc tiếng Việt** (Text-to-Speech) đọc câu hỏi cho bé chưa biết chữ.
- **Phản hồi tức thì**: hiệu ứng âm thanh, pháo giấy, khen ngợi, cho làm lại khi sai (không phạt).
- **Thưởng sao & huy hiệu**: động lực học tập, xem thành tích riêng cho từng bé.
- **Hoạt động offline** (PWA), lưu dữ liệu ngay trên thiết bị, không cần đăng nhập.

## 🧭 Lộ trình học (19 chặng)

| Chặng | Nội dung | Độ tuổi |
|------|----------|---------|
| 1 | Bé đếm 1–5 | 3–4 |
| 2 | Nhiều hơn – Ít hơn | 3–4 |
| 3 | Thế giới hình khối | 3–4 |
| 4 | Đếm đến 10 & số thứ tự | 4–5 |
| 5 | Quy luật & phân loại | 4–5 |
| 6 | Phương hướng & thời gian | 4–5 |
| 7 | Bé đo lường | 4–5 |
| 8 | Gộp – Tách trong 10 | 5–6 |
| 9 | Phép cộng trong 10 | Tiền tiểu học |
| 10 | Phép trừ trong 10 | Tiền tiểu học |
| 11 | Khối hình học 3 chiều | Tiền tiểu học |
| 12 | Tập tô chữ số (Montessori) | 5–6 |
| 13 | Montessori nâng cao (hạt vàng, bảng 100) | Tiền tiểu học |
| 14 | Đếm đến 20 & số liền trước–sau | Tiền tiểu học |
| 15 | Đếm cách 2/5 & đếm lùi | Tiền tiểu học |
| 16 | So sánh trong 10 | 5–6 |
| 17 | Bé cộng thành thạo | Tiền tiểu học |
| 18 | Bé trừ thành thạo | Tiền tiểu học |
| 19 | Gộp – Tách nâng cao (tách của 6, của 10) | 5–6 |

> Mỗi chặng tự động có thêm bài **"Ôn tập chặng"** tổng hợp các dạng bài trong chặng.

## 🛠️ Công nghệ

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** cho giao diện
- **vite-plugin-pwa** để cài đặt như ứng dụng gốc
- **Web Speech API** (giọng đọc) và **Web Audio API** (hiệu ứng âm thanh) — thuần trình duyệt, không phụ thuộc dịch vụ ngoài
- **Twemoji** (ảnh emoji SVG, giấy phép CC-BY 4.0) cho hình minh hoạ đồng nhất, đẹp trên mọi thiết bị — nhúng offline trong `public/emoji/` (xem `scripts/gen-emoji.mjs`)

## 🖼️ Bản quyền hình ảnh

Ứng dụng chỉ dùng hình **miễn phí bản quyền**: emoji **Twemoji** (© Twitter, CC-BY 4.0) và các hình vẽ/nhân vật **gốc** do dự án tự thiết kế. Không sử dụng nhân vật thương hiệu (Pokémon, Marvel/DC…).

## 🚀 Chạy dự án

```bash
npm install        # cài đặt phụ thuộc
npm run dev        # chạy môi trường phát triển
npm run build      # đóng gói bản production (thư mục dist/)
npm run preview    # xem thử bản build
node scripts/gen-icons.mjs   # tạo lại icon PWA (đã có sẵn trong public/)
```

Mở trên điện thoại/máy tính bảng rồi chọn **"Thêm vào màn hình chính"** để cài như một ứng dụng.

## 📁 Cấu trúc chính

```
src/
  data/curriculum.ts     # Toàn bộ giáo trình 10 chặng (nguồn nội dung)
  engine/generators.ts   # Sinh câu hỏi ngẫu nhiên theo từng dạng bài
  engine/themes.ts       # Bộ icon theo chủ đề (hoa quả, con vật…)
  audio/sound.ts         # Giọng đọc tiếng Việt + hiệu ứng âm thanh
  store/store.tsx        # Hồ sơ trẻ & tiến độ (localStorage)
  components/            # Thành phần UI: hình, nhóm đồ vật, sao, mascot, confetti…
  screens/              # Onboarding, Home (bản đồ), LessonPlayer, Rewards, Settings
docs/GIAO-TRINH.md       # Nghiên cứu & cơ sở học thuật của giáo trình
```
