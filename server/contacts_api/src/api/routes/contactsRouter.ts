import { Router } from "express";
import {validateContactCreation, validateContactUpdate, validateContactId} from "../../middleware/contactValidation";
import { ContactRepository } from "../../repositories/ContactRepository";
import {ContactHistoryRepository} from "../../repositories/ContactHistoryRepository";
import ContactsController from "../controllers/ContactsController";
import ContactService from "../../services/ContactService";
import ContactHistoryService from "../../services/ContactHistoryService";

const router = Router();
const contactRepository = new ContactRepository();
const contactHistoryRepository = new ContactHistoryRepository();

const contactService = new ContactService(contactRepository);
const contactHistoryService = new ContactHistoryService(contactHistoryRepository);

const contactsController = new ContactsController(contactService, contactHistoryService);

router.use("/:id", validateContactId);

router.get("/", (req, res) => {
    contactsController.getAllContacts(req, res);
});

router.post("/", validateContactCreation, (req, res) => {
    contactsController.createContact(req, res);
});

router.put("/:id", validateContactUpdate, (req, res) => {
    contactsController.updateContact(req, res);
});

router.delete("/:id", (req, res) => {
    contactsController.deleteContact(req, res);
});

router.get("/:id", (req, res) => {
    contactsController.getContactById(req, res);
});

export default router;