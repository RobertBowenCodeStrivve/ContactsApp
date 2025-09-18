
import { Request, Response } from 'express';
import ContactService from '../../services/ContactService';
import ContactHistoryService from '../../services/ContactHistoryService';
import { ContactRepository } from '../../repositories/ContactRepository';
import { ContactHistoryRepository } from '../../repositories/ContactHistoryRepository';
import {handleUnexpectedError} from "../../common/error_handle";
import type { ChangeType } from '../../services/ContactHistoryService';
export default class ContactsController {

  private contactsService: ContactService;
  private contactHistoryService: ContactHistoryService;

  constructor(
  ) {
    this.contactsService = new ContactService(new ContactRepository());
    this.contactHistoryService = new ContactHistoryService(new ContactHistoryRepository());
  } 

  public async addContactHistory(changeType: ChangeType, contactId: number, changedValues: any) {
      await this.contactHistoryService.addHistory(changeType, contactId, changedValues);
  }

  async getAllContacts(req: Request, res: Response) {
     try{
        const contacts = await this.contactsService.getAllContacts();
        res.json({contacts, message: "Contacts fetched successfully"});
     }
    catch(error){
        handleUnexpectedError(res, error);
    }
  }

  async getContactById(req: Request, res: Response) {
    const { id } = req.params;
    const contactId = Number(id);
    try{
        const contact = await this.contactsService.getContactById(contactId);
        res.json({contacts : [contact], message: "Contact fetched successfully"});
     }
    catch(error){
        handleUnexpectedError(res, error);
    }
  }

  async createContact(req: Request, res: Response) {
    const contactData = req.body;
    try{
        const contact = await this.contactsService.createContact(contactData);
        await this.addContactHistory('CREATE', contact[0].id, contactData);
        res.status(200).json({
          message: "Contact created successfully",
          contact
        });
     }
    catch(error){
        handleUnexpectedError(res, error);
    }
  }

  async updateContact(req: Request, res: Response) {
      const { id } = req.params;
      const contactId = Number(id);
      const contactData = req.body;
      try{
          const updatedContact = await this.contactsService.updateContact(contactId, contactData);
          await this.addContactHistory('UPDATE', contactId, contactData);
          res.status(200).json({
          message: "Contact updated successfully",
          contact: updatedContact
        });
     }
    catch(error){
        handleUnexpectedError(res, error);
    }
}

async deleteContact(req: Request, res: Response) {
    const { id } = req.params;
    const contactData = Number(id);
    try{
            await this.contactsService.deleteContact(contactData);
            res.status(200).json({
            message: "Contact deleted successfully",
        });

        await this.addContactHistory('DELETE', contactData, null);
     }
    catch(error){
        handleUnexpectedError(res, error);
    }
  }

}