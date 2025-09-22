
import type {Contact, ContactHistory, DB} from '@contacts/database'
import { DatabaseManager } from "@contacts/database";
import type { Kysely, Transaction} from "kysely";
export class ContactHistoryRepository {

    private db: Kysely<DB>;
    public constructor() {
        this.db = DatabaseManager.getConnection(process.env.DB_NAME as string);
    }

    public async getContactHistory(contactId: number) {
        //').where('batch_id', 'is not', null)      // WHERE batch_id IS NOT NULL .groupBy('batch_id')
        const history = await this.db.selectFrom('contact_history')
            .selectAll()
            .where('contact_id', '=', contactId)
            .orderBy('id', 'asc')
            .execute();
         if(history.length === 0) {
            throw new Error(`No history found for contact with ID ${contactId}`);
         }  
         return history;
    }

    public async addHistory(changeType: string, fieldName: string | null, newValue: string | null, contactId: number, batchId: string,  trx: Kysely<DB> | Transaction<DB> = this.db) {
        const historyRecord= {
            batch_id: batchId,
            change_type: changeType,
            field_name: fieldName,
            new_value: newValue,
            contact_id: contactId,
        }

        try{
            return await this.db.insertInto('contact_history')
            .values(historyRecord)
            .returningAll()
            .executeTakeFirstOrThrow();
        }
        catch(error : any){
            console.error("Error adding contact history:", error);
            throw new Error(`Failed to add contact history: ${error.message}`);
        }
    }
}