import ContactHistoryService from "../../services/ContactHistoryService";
import { ContactHistoryRepository } from "../../repositories/ContactHistoryRepository"; 
import {handleUnexpectedError} from "../../common/error_handle";   
import { Request, Response } from "express";


export default class ContactHistoryController {
    private contactHistoryService: ContactHistoryService;
    constructor(
    ) {
        this.contactHistoryService = new ContactHistoryService(new ContactHistoryRepository());
    } 

    async getContactHistory(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const contactId = Number(id);
            const history = await this.contactHistoryService.getContactHistory(contactId);
            res.json({history, message: "Contact history fetched successfully"});
         }
        catch(error){
            handleUnexpectedError(res, error);
        }
    }
}


