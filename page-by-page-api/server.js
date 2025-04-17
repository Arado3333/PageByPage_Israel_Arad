
import "dotenv/config"; //הגדרת השרת לקבלת משתני סביבה מהקובץ .env
import express from "express";
import router from "./routes/book.routes.js";

const PORT = process.env.PORT || 5000;

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true })); //תמיכה בכתובת בתווים שאינם לטיניים

//route --> controller --> model --> database
server.use("/api/books", router);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
