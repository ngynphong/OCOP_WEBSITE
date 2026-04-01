Thay vì gom tất cả components vào thư mục src/components, hãy nhóm code theo từng tính năng (Feature) hoặc nghiệp vụ (Domain). Điều này giúp dự án không bị phình to và lộn xộn khi có hàng trăm file.

src/
├── app/ # Chứa routing (Next.js App Router)
├── components/ # Chỉ chứa UI components dùng chung (Button, Modal, Input)
├── features/ # (QUAN TRỌNG) Chứa logic nghiệp vụ
│ ├── auth/ # Nghiệp vụ đăng nhập, đăng ký
│ │ ├── api/ # Các hàm gọi API (axios) của auth
│ │ ├── components/ # UI components chỉ dùng riêng cho auth (LoginForm)
│ │ ├── hooks/ # Custom hooks của auth
│ │ └── types/ # TypeScript interfaces
│ ├── products/ # Nghiệp vụ sản phẩm
│ └── cart/ # Nghiệp vụ giỏ hàng
├── lib/ # Các config thư viện bên thứ 3 (axios, tailwind merge)
└── utils/ # Các hàm helper dùng chung (formatDate, formatCurrency)
