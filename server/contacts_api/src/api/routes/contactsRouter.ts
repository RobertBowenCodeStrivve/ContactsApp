import { Router } from "express";
import {validateContactCreation, validateContactUpdate, validateContactId} from "../../middleware/contactValidation";
import ContactsController from "../controllers/ContactsController";

export default class ContactsRouter {
    private router = Router();
    private contactController: ContactsController;
    constructor() {
        this.contactController = new ContactsController(); 
        this.initRoutes();   
    }
    public getRouter() {
        return this.router;
    }
    private initRoutes() {
        this.router.use("/:id", validateContactId);
        this.router.get("/", (req, res) => {
            this.contactController.getAllContacts(req, res);
        });
        this.router.post("/", validateContactCreation, (req, res) => {
            this.contactController.createContact(req, res);
        });
        this.router.put("/:id", validateContactUpdate, (req, res) => {
            this.contactController.updateContact(req, res);
        });
        this.router.delete("/:id", (req, res) => {
            this.contactController.deleteContact(req, res);
        });
        this.router.get("/:id", (req, res) => {
            this.contactController.getContactById(req, res);
        });
    }
}
