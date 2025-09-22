import express from 'express';
import cors from 'cors';
import {DatabaseManager, databaseType, db_options} from '@contacts/database'
import { ContactEventTypes } from './events/ContactEmitter';
const app = express();
import { WebSocketServer } from 'ws';
import {createServer} from 'http';
import ContactsRouter from './api/routes/contactsRouter';
import ContactsHistoryRouter from './api/routes/contactsHistoryRouter';
import { contactEventEmitter} from './events/ContactEmitter';

//express middleware
app.use(cors({
  origin: [`${process.env.VITE_URL}`, `${process.env.VITE_DEBUG_URL}`], //for vite
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

// Initialize database connection
DatabaseManager.addConnection({
    type: db_options.POSTGRES as databaseType.POSTGRES,
    host: process.env.DB_HOST as string,
    port: process.env.DB_PORT as unknown as number,
    database: process.env.DB_NAME as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string
})

//setup the routes  
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
const server = createServer(app);


const wss = new WebSocketServer({ server });
//setup event listeners
const setupListeners = () => {
  wss.on('connection', (ws: any) => {
    console.log('New client connected');
  });
  contactEventEmitter.on(ContactEventTypes.CREATED, (newContact) => {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: ContactEventTypes.CREATED, data: newContact }));
      }
    });
  });
  contactEventEmitter.on(ContactEventTypes.UPDATED, (updates) => {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: ContactEventTypes.UPDATED, data: updates }));
      }
    });
  });
  contactEventEmitter.on(ContactEventTypes.DELETED, (id) => {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ event: ContactEventTypes.DELETED, data: id }));
      }
    });
  });
};

setupListeners();

server.listen(port, () => {
    console.log(`Contact API server listening on port ${port}`);
});
