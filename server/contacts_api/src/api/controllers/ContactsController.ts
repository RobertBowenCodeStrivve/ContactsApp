
import { Request, Response } from 'express';
import ContactService from '../../services/ContactService';
import ContactHistoryService from '../../services/ContactHistoryService';
export default class ContactsController {

  constructor(
    private contactsService: ContactService,
    private contactHistoryService: ContactHistoryService
  ) {} 

  handleUnexpectedError(res: Response, error: unknown) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }

  async getAllContacts(req: Request, res: Response) {
     try{
        const contacts = await this.contactsService.getAllContacts();
        res.json(contacts);
     }
    catch(error){
        this.handleUnexpectedError(res, error);
    }
  }

  async getContactById(req: Request, res: Response) {
    const { id } = req.params;
    try{
        const contact = await this.contactsService.getContactById(id);
        res.json(contact);
     }
    catch(error){
        this.handleUnexpectedError(res, error);
    }
  }

  async createContact(req: Request, res: Response) {
    const contactData = req.body;
    try{
        const contact = await this.contactsService.createContact(contactData);
        // Log the creation in contact history
        res.status(200).json({
          message: "Contact created successfully",
          data: contact
        });
     }
    catch(error){
        this.handleUnexpectedError(res, error);
    }
  }

  async updateContact(req: Request, res: Response) {
      const { id } = req.params;
      const contactData = req.body;
      try{
          const updatedContact = await this.contactsService.updateContact(id, contactData);
          // Log the update in contact history
          res.status(200).json({
          message: "Contact updated successfully",
          data: updatedContact
        });
     }
    catch(error){
        this.handleUnexpectedError(res, error);
    }
}

async deleteContact(req: Request, res: Response) {
    const { id } = req.params;
      try{
          await this.contactsService.deleteContact(id);
          // Log the deletion in contact history
          res.status(200).json({
          message: "Contact deleted successfully",
        });
     }
    catch(error){
        this.handleUnexpectedError(res, error);
    }
}

}