import { Router } from "express";

const router = Router();

router.get("/:id", (req, res) => {
    res.send("Get a single contact history record");
});

export default router;