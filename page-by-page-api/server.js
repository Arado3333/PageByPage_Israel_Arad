import "dotenv/config"; //הגדרת השרת לקבלת משתני סביבה מהקובץ .env
import cors from "cors";
import express from "express";
import bookRouter from "./services/books/routes/book.routes.js";
import userRouter from "./services/users/routes/users.routes.js";
import aiRouter from "./services/ai_assistant/routes/ai.routes.js";
import projectsRouter from "./services/book_projects/project.routes.js";
import tasksRouter from "./services/tasks/tasks.routes.js";
import versionsRouter from "./services/versions/versions.routes.js";

const PORT = process.env.PORT || 5500;

const server = express();
server.use(cors());
server.use(express.json()); 
server.use(express.urlencoded({ extended: true })); //תמיכה בכתובת בתווים שאינם לטיניים

//route --> controller --> model --> database
server.use("/api/books", bookRouter);
server.use("/api/projects", projectsRouter);
server.use("/api/users", userRouter);
server.use("/api/chat", aiRouter);
server.use("/api/tasks", tasksRouter);
server.use("/api/versions", versionsRouter);


server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});