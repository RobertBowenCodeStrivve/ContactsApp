import { ContactHistoryRepository } from "../repositories/ContactHistoryRepository";




export default class ContactHistoryService {
    constructor(private contactHistoryRepository: ContactHistoryRepository) {}
    public async addHistory(type: string, contactId: string, data: any) {
        // Logic to log contact creation
    }

}