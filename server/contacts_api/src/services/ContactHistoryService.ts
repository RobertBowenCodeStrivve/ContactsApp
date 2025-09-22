import { ContactHistoryRepository } from "../repositories/ContactHistoryRepository";
import type {DB} from '@contacts/database'
import { Transaction } from "kysely";
export type ChangeType = 'CREATE' | 'UPDATE';

export default class ContactHistoryService {
    private valid_change_types: Record<ChangeType, ChangeType> = {
    "CREATE": 'CREATE',
    'UPDATE': 'UPDATE',
  };
    constructor(private contactHistoryRepository: ContactHistoryRepository) {}

    private generateBatchId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    private check_valid_field = (field: string) => {
        const valid_fields = ['email', 'first_name', 'last_name', 'phone_number'];
        return valid_fields.includes(field);
    }

    public async addHistory(type: ChangeType, contactId: number, changes: any, trx? : Transaction<DB>) {
        if(!this.valid_change_types[type]) {
            throw new Error(`Invalid change type: ${type}`);
        }
        const historyRecords = [];
        const batchId = this.generateBatchId();
        for(const [key, value] of Object.entries(changes)) {
            if(this.check_valid_field(key)) {
                historyRecords.push(await this.contactHistoryRepository.addHistory(type, key, JSON.stringify(value), contactId, batchId, trx));
            }
        }
        return historyRecords
    }

    public async getContactHistory(contactId: number) {
        return this.contactHistoryRepository.getContactHistory(contactId);
    }
}