## Server API - Quản lý sản phẩm

**Mô tả:**

Đây là server API sử dụng Express.js và MongoDB để quản lý thông tin sản phẩm. Server hỗ trợ các chức năng sau:

- **Thêm sản phẩm:** Cho phép thêm sản phẩm mới với tên, hình ảnh, productid và số lượng.
- **Lấy danh sách sản phẩm:** Cho phép truy xuất danh sách tất cả sản phẩm.

**Cài đặt:**

1. Cài đặt Node.js và npm: [Link tải Node.js](https://nodejs.org/)
2. Cài đặt các dependency:
   ```bash
   npm install
   ```
3. Cấu hình biến môi trường:
   - Tạo file `.env` và thêm các biến cần thiết:
     ```
     PORT=3000
     MONGODB_URI=mongodb+srv://<username>:<password>@<hostname>/<database>?retryWrites=true&w=majority
     ```
   - Thay thế `<username>`, `<password>`, `<hostname>` và `<database>` bằng thông tin thực tế của cơ sở dữ liệu.
4. Khởi động server:
   ```bash
   npm start
   ```

**Tài liệu API:**

- **Endpoint:** `/products`
  - **Phương thức:** `POST`
    - **Dữ liệu:**
      ```json
      {
        "productid": "string",
        "name": "string",
        "image": "file", // File hình ảnh
        "quantity": "number"
      }
      ```
    - **Trả về:**
      ```json
      {
        "productid": "string",
        "name": "string",
        "image": "string", // Đường dẫn đến hình ảnh
        "quantity": "number"
      }
      ```
  - **Phương thức:** `GET`
    - **Trả về:**
      ```json
      [
          {
              "productid": "string",
              "name": "string",
              "image": "string", // Đường dẫn đến hình ảnh
              "quantity": "number"
          },
          ...
      ]
      ```

**Kiến trúc:**

- Server sử dụng kiến trúc RESTful API.
- Dữ liệu được lưu trữ trong cơ sở dữ liệu MongoDB.
- Các endpoint API được định nghĩa và xử lý bởi Express.js.

**Kiểm thử:**

- Sử dụng các công cụ như Postman hoặc curl để kiểm thử các endpoint API.

**Phát triển:**

- Sử dụng các công cụ như VS Code để phát triển server.

**Ghi chú:**

- Server này là ví dụ cơ bản về quản lý sản phẩm với chức năng thêm sản phẩm và lấy danh sách sản phẩm.
- Có thể mở rộng server để thêm các chức năng khác như: cập nhật sản phẩm, xóa sản phẩm, tìm kiếm sản phẩm, v.v.
