export interface Contact {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  }

  export interface ContactHistory {
    id: string;
    contact_id: string;
    field_changed: string;
    old_value: string;
    new_value: string;
    changed_at: string;
  }