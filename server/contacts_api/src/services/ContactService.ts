
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
        // return this.contactRepository.createContact(contactData);
    }
    async updateContact(id: string, contactData: any) {
        // Logic to update an existing contact
    }
    async deleteContact(id: string) {
        // Logic to delete a contact
    }
}