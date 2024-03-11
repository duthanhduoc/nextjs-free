# Giới thiệu về API

Đây là backend API cho dự án Next.js Free. Chủ đề là một Shop bán hàng đơn giản với với các chức năng cơ bản:

- Authentication: Login, Register, Logout
- Account: Get thông tin cá nhân, Cập nhật thông tin cá nhân
- Product: Thêm, Sửa, Xóa sản phẩm, Lấy danh sách sản phẩm
- Media: Upload hình ảnh
- Test API

## Công nghệ sử dụng

Node.js + Fastify + Sqlite

## Cài đặt

Chỉ cần clone repository này về máy, cd vào thư mục, cài đặt các packages và chạy lệnh `npm run dev` là được

```bash
cd server
npm i
npm run dev
```

Trong trường hợp muốn chạy production, chạy lệnh

```bash
npm run build
npm run start
```

Muốn xem thông tin database, chỉ cần mở Prisma Studio lên bằng câu lệnh

```bash
npx prisma studio
```

Nó sẽ chạy ở url [http://localhost:5555](http://localhost:5555)

Trong source code có chứa file `.env` để config, trong file này bạn có thể đổi port cho API backend, mặc định là port `4000`

Khi upload thì hình ảnh sẽ được đi vào thư mục `/uploads` trong folder `server`

## Format response trả về

Định dạng trả về là JSON, và luôn có trường `message`, ngoài ra có thể sẽ có trường `data` hoặc `errors`

Đây là ví dụ về response trả về khi thành công

```json
{
  "data": {
    "id": 2,
    "name": "Iphone 11",
    "price": 20000000,
    "description": "Mô tả cho iphone 11",
    "image": "http://localhost:4000/static/bec024f9ea534b7fbf078cb5462b30aa.jpg",
    "createdAt": "2024-03-11T03:51:14.028Z",
    "updatedAt": "2024-03-11T03:51:14.028Z"
  },
  "message": "Tạo sản phẩm thành công!"
}
```

Trong trường hợp lỗi thì nếu lỗi liên quan đến việc body gửi lên không đúng định dạng thì server sẽ trả về lỗi `422` và thông tin lỗi như sau

Ví dụ dưới đây body thiếu trường `price`

```json
{
  "message": "A validation error occurred when validating the body...",
  "errors": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "undefined",
      "path": ["price"],
      "message": "Required",
      "field": "price"
    }
  ],
  "code": "FST_ERR_VALIDATION",
  "statusCode": 422
}
```

Trong trường hợp lỗi khác, server sẽ trả về lỗi trong trường `message`, ví dụ

```json
{
  "message": "Không tìm thấy dữ liệu!",
  "statusCode": 404
}
```

## Chi tiết các API

Mặc định API sẽ chạy ở địa chỉ [http://localhost:4000](http://localhost:4000), các bạn nào muốn đổi port thì vào file `.env` để thay đổi port

Với các API POST, PUT thông thường thì body gửi lên phải là JSON, và phải có header `Content-Type: application/json`.

Đặc biệt API upload hình ảnh thì phải gửi dưới dạng `form-data`

API xác thực người dùng thông qua session token, session token này là một JWT, secret key JWT này sẽ được lưu trong file `.env` và được sử dụng để tạo và verify token

Đối với các API cần xác thực người dùng như bên cụm API về `Account` thì bạn có 2 cách để server biết bạn là ai:

1. Gửi session token thông qua header `sessionToken`
2. Để cookie tự gửi lên (vì khi gọi api login hay register thì server sẽ set cookie cho bạn)

### Test API: muốn biết api có hoạt động không

- `GET /test`: Trả về message nghĩa là API hoạt động

### Authentication

- `POST /auth/register`: Đăng ký tài khoản

```json
{
  "name": "Dư Thanh Được",
  "email": "user@gmail.com",
  "password": "123123",
  "confirmPassword": "123123"
}
```

Khi register, login thành công thì server sẽ tự động set cookie cho domain là `localhost` với tên là `sessionToken`

- `POST /auth/login`: Đăng nhập

```json
{
  "email": "user@gmail.com",
  "password": "123123"
}
```

- `POST /auth/logout`: Đăng xuất với body là `null`, yêu cầu xác thực

Khi logout thì server của mình sẽ tự động remove cookie `sessionToken` đi

### Account: Cần xác thực

- `GET /account/me`: Lấy thông tin cá nhân
- `PUT /account/me`: Cập nhật thông tin cá nhân

```json
{
  "name": "Dư Thanh Được"
}
```

### Media: Cần xác thực

- `POST /media/upload`: Upload hình ảnh

Body gửi dưới dạng `form-data`, key là `file`, value là file hình ảnh.

API này mình cũng làm nhanh nên backend không có validate ảnh có đúng định dạng gì không, nên các bạn upload cho đúng hình ảnh là được.

Giới hạn file upload là 10MB

### Products

- `GET /products`: Lấy danh sách sản phẩm
- `POST /products`: Thêm sản phẩm (Cần xác thực)
  Body định dạng sau

  ```json
  {
    "name": "Iphone 11",
    "price": 20000000,
    "description": "Mô tả cho iphone 11",
    "image": "http://localhost:4000/static/bec024f9ea534b7fbf078cb5462b30aa.jpg"
  }
  ```

- `PUT /products/:id`: Sửa sản phẩm, body tương tự như thêm sản phẩm (Cần xác thực)
- `DELETE /products/:id`: Xóa sản phẩm (Cần xác thực)
- `GET /products/:id`: Lấy chi tiết sản phẩm

## Setup nhanh postman

Mình có lưu 1 file là `NextJs Free API.postman_collection.json` trong thư mục `server`, các bạn chỉ cần import file này vào Postman là có ngay collection của mình. Tiếp theo các bạn tạo 1 environment mới, và set biến `host` là `http://localhost:4000`, và chọn environment này khi gọi API là xong.
