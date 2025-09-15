import express, { Request, Response } from 'express';
import {DatabaseManager, databaseType, db_options} from '@contacts/database'
const app = express();

DatabaseManager.addConnection({
    type: db_options.POSTGRES,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD 
})





app.get('/', (req: Request, res: Response) => {
  res.send('Hello World112!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
