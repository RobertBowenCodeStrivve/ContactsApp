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
        this.router.get("/", async (req, res) => {
            await this.contactController.getAllContacts(req, res);
        });
        this.router.post("/", validateContactCreation, async (req, res) => {
            setTimeout(async () => {
                await this.contactController.createContact(req, res);
            }, 20000);
        });
        this.router.put("/:id", validateContactUpdate, async (req, res) => {
            await this.contactController.updateContact(req, res);
        });
        this.router.delete("/:id", async (req, res) => {
            await this.contactController.deleteContact(req, res);
        });
        this.router.get("/:id", async (req, res) => {
            await this.contactController.getContactById(req, res);
        });
    }
}
