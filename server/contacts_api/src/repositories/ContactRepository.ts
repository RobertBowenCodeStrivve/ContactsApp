import type {Contact, DB} from '@contacts/database'
import { DatabaseManager } from "@contacts/database";
import type { Kysely, Transaction } from "kysely";
export class ContactRepository {

    private db: Kysely<DB>;
    public constructor()
    {
        this.db = DatabaseManager.getConnection(process.env.DB_NAME as string);
    }
    
    public async getAllContacts() {
        const contacts = await this.db
            .selectFrom('contact')
            .selectAll()
            .execute()
        return contacts;
    }

    public async getContactById(id: number) {
        try {
            const contact = await this.db
                .selectFrom('contact')
                .selectAll()
                .where('id', '=', id)
                .executeTakeFirst();
            if (!contact) throw new Error('Contact not found');
            return contact;
        }
        catch(error) {
            console.error('Error fetching contact by ID:', error);
            throw new Error('Failed to fetch contact');
        }
    }

    public async createContact(contact: any, trx: Kysely<DB> | Transaction<DB> = this.db) {
        const new_contact = {
            email: contact.email as string,
            first_name: contact.first_name as string,
            last_name: contact.last_name as string,
            phone_number: contact.phone_number as string,
        }
        try{
            return await trx.insertInto('contact').values(new_contact).returningAll().execute();
        }
        catch(error : any)
        {
            console.error('Error creating contact:', error);
            const prefix_error = 'Failed to create contact:';
            if (!(error.code === '23505')) { 
                throw new Error(`${prefix_error} An unexpected error occurred`);
            }
            
            if (error.detail?.includes('email')) {
                throw new Error(`${prefix_error} Email already exists`)
            }
            
            throw new Error(`${prefix_error} Duplicate value detected`)
        }
    }

    public async updateContact(id: number, contactData: any, trx: Kysely<DB> | Transaction<DB> = this.db) {
        try{
            const updatedRows = await trx.updateTable('contact')
            .set(contactData)
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();
            return updatedRows;
        }
        catch(error : any)
        {
            console.error('Error updating contact:', error);
            const prefix_error = 'Failed to update contact:';
            if (!(error.code === '23505')) { 
                throw new Error(`${prefix_error} An unexpected error occurred`);
            }
            if (error.detail?.includes('email')) {
                throw new Error(`${prefix_error} Email already exists`)
            }
            throw new Error(`${prefix_error} Duplicate value detected`)
        }
    }

    public async deleteContact(id: number) {
        try {
            const deletedRows = await this.db
                .deleteFrom('contact')
                .where('id', '=', id)
                .executeTakeFirst();
            if (deletedRows.numDeletedRows === BigInt(0)) {
                throw new Error('Contact not found or already deleted');
            }
            return { message: 'Contact deleted successfully', deletedRows: deletedRows.numDeletedRows };
        } catch (error : any) {
            console.error('Error deleting contact: ', error);
            throw new Error(`Failed to delete contact: ${error.message}`); // Rethrow the error with a custom message
        }
    }
}