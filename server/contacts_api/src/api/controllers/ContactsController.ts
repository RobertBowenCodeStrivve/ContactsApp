
import { Request, Response } from 'express';
import ContactService from '../../services/ContactService';
import ContactHistoryService from '../../services/ContactHistoryService';
export default class ContactsController {

  constructor(
    private contactsService: ContactService,
    private contactHistoryService: ContactHistoryService
  ) {} 

  async getAllContacts(req: Request, res: Response) {
     try{
        //get all contacts using contactService
     }
    catch(error){
        res.status(500).json({message: "Internal Server Error" });
    }
  }

  async getContactById(req: Request, res: Response) {
    // use contactService to get contact by id
  }

  async createContact(req: Request, res: Response) {
    // use contactService to create a new contact
    // use contactHistoryService to save the creation event in history
  }

  async updateContact(req: Request, res: Response) {
    // use contactService to update the contact
    // use contactHistoryService to save the update event in history
  }

async deleteContact(req: Request, res: Response) {
  // use contactService to delete the contact
  // use contactHistoryService to save the deletion event in history
}

}