import type {DB} from '@contacts/database'
import { DatabaseManager } from "@contacts/database";
import type {Transaction } from "kysely";
export class TransactionRepository {
    public static async executeSingleTransaction(fn: (trx: Transaction<DB>) => Promise<any>) {
        return DatabaseManager.getConnection(process.env.DB_NAME as string).transaction().execute(async (trx) => {
            return await fn(trx);
        });
    }
}