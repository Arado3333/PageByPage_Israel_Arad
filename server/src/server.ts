import 'dotenv/config'; // apply env vars
import express from 'express';
import cors from 'cors'; // enable CORS
import v1Router from './routes/v1'; // import the router

//process.env.PORT --> the live server port
const PORT = process.env.PORT || 5500;

//create the server
const server = express();

//config JSON support
server.use(cors());
server.use(express.json({ limit: '50mb' })); // limit the size of the JSON body to 50mb
server.use(express.urlencoded({ limit: '50mb', extended: true })); // limit the size of the URL encoded body to 50mb

//using routes
server.use('/api/v1', v1Router);

//run the server
server.listen(PORT, () => console.log(`[Server] http://localhost:${PORT}`));
