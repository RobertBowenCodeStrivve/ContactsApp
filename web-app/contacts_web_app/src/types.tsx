export interface Contact {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  }

export interface ContactHistory {
    id: number;
    contact_id: string;
    batch_id: string;
    change_type: 'CREATE' | 'UPDATE' | 'DELETE';
    field_name: string;
    new_value: string;
    changed_at: string;
    }

export interface HistoryBatch {
  id: number;
  changes : ContactHistory[];
  batch_id: string; 
  changed_at: string;
} 