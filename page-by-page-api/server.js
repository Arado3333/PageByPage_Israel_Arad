import "dotenv/config"; //הגדרת השרת לקבלת משתני סביבה מהקובץ .env
import express from "express";
import bookRouter from "./services/books/routes/book.routes.js";
import userRouter from "./services/users/routes/users.routes.js";

const PORT = process.env.PORT || 5500;

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true })); //תמיכה בכתובת בתווים שאינם לטיניים

//route --> controller --> model --> database
server.use("/api/books", bookRouter);
server.use("/api/users", userRouter);

server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
