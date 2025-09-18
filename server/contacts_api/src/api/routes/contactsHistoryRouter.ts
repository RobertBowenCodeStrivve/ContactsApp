import { Router } from "express";




const router = Router();

export default class ContactsHistoryRouter {
    private router = Router();
    constructor() {
        this.initRoutes();   
    }
    public getRouter() {
        return this.router;
    }
    private initRoutes() {
        this.router.get("/:id", (req, res) => {
            res.send("Get a single contact history record");
        });
    }
}
