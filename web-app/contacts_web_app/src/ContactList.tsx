  import React, { useState, useEffect } from 'react';
  import ContactComponent from './ContactComponent';
  import AddContactModal from './AddContactModal';
  import type { Contact } from './types';

  const ContactList: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
      fetchContacts();
    }, []);

    const fetchContacts = async () => {
      try {
        const response = await fetch(`${apiUrl}/contacts`);
        const data = await response.json();
        const contacts = data.contacts ? data.contacts : []; // Adjust based on API response structure
        setContacts(contacts);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleContactUpdate = (updatedContact: Contact) => {
      setContacts(contacts.map(contact =>
        contact.id === updatedContact.id ? updatedContact : contact
      ));
    };

    const handleContactDelete = (contactId: string) => {
      setContacts(contacts.filter(contact => contact.id !== contactId));
    };

    const handleContactAdded = (newContact: Contact) => {
      setContacts([...contacts, newContact]);
    };

    if (loading) return <div>Loading contacts...</div>;

    return (
      <div className="contact-list">
        <div className="contact-list-header">
          <h2>Contacts ({contacts.length})</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="add-contact-btn"
          >
            Add New Contact
          </button>
        </div>

        {contacts.length === 0 ? (
          <div className="no-contacts">
            <p>No contacts found. Add your first contact!</p>
          </div>
        ) : (
          contacts.map(contact => (
            <ContactComponent
              key={contact.id}
              contact={contact}
              onUpdate={handleContactUpdate}
              onDelete={handleContactDelete}
            />
          ))
        )}

        <AddContactModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onContactAdded={handleContactAdded}
        />
      </div>
    );
  };

  export default ContactList;