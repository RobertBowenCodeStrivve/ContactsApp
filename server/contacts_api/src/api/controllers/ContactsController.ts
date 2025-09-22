
import { Request, Response } from 'express';
import ContactService from '../../services/ContactService';
import ContactHistoryService from '../../services/ContactHistoryService';
import { ContactRepository } from '../../repositories/ContactRepository';
import { ContactHistoryRepository } from '../../repositories/ContactHistoryRepository';
import { TransactionRepository } from '../../repositories/TransactionRepository';
import {handleUnexpectedError} from "../../common/error_handle";
import { contactEventEmitter, ContactEventTypes  } from '../../events/ContactEmitter';

export default class ContactsController {

  private contactsService: ContactService;
  private contactHistoryService: ContactHistoryService;

  constructor(
  ) {
    this.contactsService = new ContactService(new ContactRepository());
    this.contactHistoryService = new ContactHistoryService(new ContactHistoryRepository());
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
      await this.contactHistoryService.addHistory('CREATE', contact[0].id, contactData); // not worried about race condition as create will always happen before update
      res.status(200).json({
        message: "Contact created successfully",
        contact : contact[0]
      });
      contactEventEmitter.emit(ContactEventTypes.CREATED, contact[0]);
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
        await TransactionRepository.executeSingleTransaction(async (trx) => { //we want to update contact and add history in single transaction so that history and contact will be consistent
            const updatedContact = await this.contactsService.updateContact(contactId, contactData);
            const history_update_batch = await this.contactHistoryService.addHistory('UPDATE', contactId, contactData, trx);
            res.status(200).json({
              message: "Contact updated successfully",
              contact: updatedContact
            });
            contactEventEmitter.emit(ContactEventTypes.UPDATED, history_update_batch);
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
            id : contactData
            });
            contactEventEmitter.emit(ContactEventTypes.DELETED, contactData);
     }
    catch(error){
        handleUnexpectedError(res, error);
    }
  }

}