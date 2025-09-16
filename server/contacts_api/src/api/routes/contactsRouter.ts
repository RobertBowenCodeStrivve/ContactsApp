import { Router } from "express";
import {validateContactCreation, validateContactUpdate, validateContactId} from "../../middleware/contactValidation";
const router = Router();

router.get("/", (req, res) => {
    res.send("List of contacts");
});

router.use("/:id", validateContactId);

router.post("/", validateContactCreation, (req, res) => {
    res.send("Create a new contact");
});

router.put("/:id", validateContactUpdate, (req, res) => {
    res.send("Update an existing contact");
});

router.delete("/:id", (req, res) => {
    res.send("Delete a contact");
});

router.get("/:id", (req, res) => {
    res.send("Get a single contact");
});


export default router;