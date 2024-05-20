// Import thư viện Express
import express from 'express';
import { Request, Response } from 'express';
import {dbConnect} from './config/dbConnect'
require('dotenv').config()
const initRoutes = require("./routes/index")
const cookieParser = require("cookie-parser")

// Khởi tạo ứng dụng Express
const app = express();
const port = process.env.PORT || 8080
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
dbConnect()
initRoutes(app)

// Định nghĩa một route cơ bản
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Lắng nghe cổng 3000 cho các kết nối HTTP
app.listen(port, () => {
  console.log('Server is running on port', port);
});

