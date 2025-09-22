import express, { Request, Response } from 'express';
import cors from 'cors';
import {DatabaseManager, databaseType, db_options} from '@contacts/database'
const app = express();
import ContactsRouter from './api/routes/ContactsRouter';
import ContactsHistoryRouter from './api/routes/ContactsHistoryRouter';

app.use(cors({
  origin: [`${process.env.VITE_URL}`], //for vite
  credentials: true
}));
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

const contactsRouter = new ContactsRouter().getRouter();
const contactsHistoryRouter = new ContactsHistoryRouter().getRouter();

app.use('/contacts', contactsRouter);
app.use('/contactsHistory', contactsHistoryRouter);
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    method: req.method,
    url: req.originalUrl,
    availableEndpoints: ['/api/contacts', '/api/contactsHistory/:id'] // optional
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
