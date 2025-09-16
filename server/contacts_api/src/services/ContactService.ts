
import { ContactRepository } from "../repositories/ContactRepository";

export default class ContactService {

    constructor(private contactRepository: ContactRepository) {}
    
    async getAllContacts() {
        return this.contactRepository.getAllContacts();
    }
    async getContactById(id: string) {
        return this.contactRepository.getContactById(id);
    }
    async createContact(contactData: any) {

        /***
         * if contact with same email or phone number exists, throw error
         * 
         * 
         * create the contact
         */
        
    }
    async updateContact(id: string, contactData: any) {
        /**
         * 
         * for each field in contactData, check if it is different from the existing value
         * if different, add to changes object
         * 
         * if changes object is not empty, log the changes in contact history
         * 
         * update the contact with the new data
         * 
         */
    }
    async deleteContact(id: string) {
        /**
         * 
         * check if contact exists
         * if not, throw error
         * 
         */
        // Logic to delete a contact
    }
}