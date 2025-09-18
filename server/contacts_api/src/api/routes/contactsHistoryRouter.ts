import { Router } from "express";
import ContactsHistoryController from "../controllers/ContactsHistoryController";
const router = Router();

export default class ContactsHistoryRouter {
    private router = Router();
    private contactsHistoryController: ContactsHistoryController;
    constructor() {
        this.contactsHistoryController = new ContactsHistoryController();
        this.initRoutes();
    }
    
    public getRouter() {
        return this.router;
    }
    private initRoutes() {
        this.router.get("/:id", (req, res) => {
            this.contactsHistoryController.getContactHistory(req, res);
        });
    }
}
