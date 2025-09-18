import { ContactHistoryRepository } from "../repositories/ContactHistoryRepository";
export type ChangeType = 'CREATE' | 'UPDATE' | 'DELETE';

export default class ContactHistoryService {
    private valid_change_types: Record<ChangeType, ChangeType> = {
    "CREATE": 'CREATE',
    'UPDATE': 'UPDATE',
    'DELETE': 'DELETE'
  };
    constructor(private contactHistoryRepository: ContactHistoryRepository) {}

    private generateBatchId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    private check_valid_field = (field: string) => {
        const valid_fields = ['email', 'first_name', 'last_name', 'phone_number'];
        return valid_fields.includes(field);
    }

    public async addHistory(type: ChangeType, contactId: number, changes: any) {
        if(!this.valid_change_types[type]) {
            throw new Error(`Invalid change type: ${type}`);
        }   
        const batchId = this.generateBatchId();
        if(!changes) { //single deletion or no changes
            if(type !== 'DELETE') {
                throw new Error('No changes provided for non-deletion operation');
            }
            this.contactHistoryRepository.addHistory(type, null, null, contactId, batchId);
            return;
        }
        for(const [key, value] of Object.entries(changes)) {
            if(this.check_valid_field(key)) {
                await this.contactHistoryRepository.addHistory(type, key, JSON.stringify(value), contactId, batchId);
            }
        }
    }

    public async getContactHistory(contactId: number) {
        return this.contactHistoryRepository.getContactHistory(contactId);
    }
}