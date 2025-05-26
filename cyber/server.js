import "dotenv/config";
import express from "express";
import { morgan } from "morgan";

const PORT = process.env.PORT || 3000;
const server = express();

server.use(express.json());
server.use(morgan("dev"));
server.use(express.urlencoded({ extended: true }));

server.use("/api/v1", router);


server.listen(PORT, () => {
    `Server is running at: http://localhost:${PORT}`;
});
