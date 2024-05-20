// Import thư viện Express
import express from 'express';
import { Request, Response } from 'express';

// Khởi tạo ứng dụng Express
const app = express();

// Định nghĩa một route cơ bản
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Lắng nghe cổng 3000 cho các kết nối HTTP
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
