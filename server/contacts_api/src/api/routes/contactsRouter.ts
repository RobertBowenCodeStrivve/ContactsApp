import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("List of contacts");
});

router.post("/", (req, res) => {
    res.send("Create a new contact");
});

router.put("/:id", (req, res) => {
    res.send("Update an existing contact");
});

router.delete("/:id", (req, res) => {
    res.send("Delete a contact");
});

router.get("/:id", (req, res) => {
    res.send("Get a single contact");
});


export default router;