import express, { Request, Response } from 'express';
import {DatabaseManager, databaseType, db_options} from '@contacts/database'
const app = express();
import contactsRouter from './api/routes/contactsRouter';
import contactsHistoryRouter from './api/routes/contactsHistoryRouter';
DatabaseManager.addConnection({
    type: db_options.POSTGRES,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD 
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
