
import { ContactRepository } from "../repositories/ContactRepository";

export default class ContactService {

    constructor(private contactRepository: ContactRepository) {}
    
    async getAllContacts() {
        return this.contactRepository.getAllContacts();
    }
    async getContactById(id: number) {
        return this.contactRepository.getContactById(id);
    }
    async createContact(contactData: any) {
        return await this.contactRepository.createContact(contactData);           
    }

    async updateContact(id: number, newContactData: any) {
        return await this.contactRepository.updateContact(id, newContactData);
    }
    async deleteContact(id: number) {
        return await this.contactRepository.deleteContact(id);
    }
}