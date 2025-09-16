import express, { Request, Response } from 'express';
import {DatabaseManager, databaseType, db_options} from '@contacts/database'
const app = express();
import contactsRouter from './api/routes/contactsRouter';
import contactsHistoryRouter from './api/routes/contactsHistoryRouter';


app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

DatabaseManager.addConnection({
    type: db_options.POSTGRES as databaseType.POSTGRES,
    host: process.env.DB_HOST as string,
    port: process.env.DB_PORT as unknown as number,
    database: process.env.DB_NAME as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string
})

app.use('/users', contactsRouter);
app.use('/usersHistory', contactsHistoryRouter);
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    method: req.method,
    url: req.originalUrl,
    availableEndpoints: ['/api/users', '/api/contacts'] // optional
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
