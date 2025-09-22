import React, { useEffect, useState } from 'react';
import type { Contact, ContactHistory } from './types';
import {History} from './History';
  import {useWebSocket, ContactEventTypes} from './events/useWebSocket';
  interface ContactProps {
    contact: Contact;
    onUpdate: (contact: Contact) => void;
    onDelete: (contactId: string) => void;
  }
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const ContactComponent: React.FC<ContactProps> = ({ contact, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContact, setEditedContact] = useState(contact);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<ContactHistory[]>([]);
    const [mostRecentChangeId, setMostRecentChangeId] = useState<number>(0);
    const [historyBatch, setHistoryBatch] = useState<Set<string> | null>(null);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const { lastMessage } = useWebSocket(apiUrl);

    const fetchHistory = async () => {
      if (history.length === 0) {
        setLoadingHistory(true);
        try {
          const response = await fetch(`${apiUrl}/contactsHistory/${contact.id}`);
          if (response.ok) {
            const historyData = (await response.json()).history;
            setHistory(historyData);
            let mostRecentChangeId = 0;
            const batchIds = new Set<string>(historyData.map((h: ContactHistory) => { 
              mostRecentChangeId = Math.max(mostRecentChangeId, h.id);
              return h.batch_id; 
            }));
            setHistoryBatch(batchIds);
            setMostRecentChangeId(mostRecentChangeId);
          }
        } catch (error) {
          console.error('Error fetching history:', error);
        } finally {
          setLoadingHistory(false);
        }
      }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const mergeUpdatedContact = (editedHistory: ContactHistory[]) => {
      if(editedHistory.length === 0) return;

      const sorted = editedHistory.sort((a, b) => a.id - b.id);
      const current_batch = sorted[0].batch_id;
      const apply_changes = sorted[0].id > mostRecentChangeId //if the change id is larger than the last change we have, we should apply it
      let add_to_history = true;

      setMostRecentChangeId(prev => Math.max(prev, sorted[sorted.length - 1].id));

      for(const batch of historyBatch!){
        if(batch === current_batch){ //it's already present in our history, don't need to add again
          add_to_history = false;
        }
      }

      if(add_to_history){ //only add new changes to history
        setHistory(prev => [...prev, ...sorted]);
        setHistoryBatch(prev => new Set(prev).add(current_batch));
      }
      
      if(!apply_changes) return;
      const updatedContact = {...contact};

      for (const change of sorted) {
        const parsed_value = JSON.parse(change.new_value);
        switch (change.field_name) {
          case 'first_name':
            updatedContact.first_name = parsed_value;
            break;
          case 'last_name':
            updatedContact.last_name = parsed_value;
            break;
          case 'email':
            updatedContact.email = parsed_value;
            break;
          case 'phone_number':
            updatedContact.phone_number = parsed_value;
            break;
        }
      }
      onUpdate(updatedContact);
    }

    useEffect(() => {
        if (!lastMessage) {
          return;
        }
        switch (lastMessage.event) {
          case ContactEventTypes.UPDATED:
            if(lastMessage.data[0].contact_id === contact.id) {
              mergeUpdatedContact(lastMessage.data); //only merge changes for this contact
            }
            break;
          default:
            break;
        }
    }, [lastMessage]);


    const handleSubmitEdit = async () => {
      setUpdating(true);
      setShowHistory(false);
      setUpdateError('');
      try {
        const contactEdits = { //only want to send changed fields
          first_name: editedContact.first_name.trim() === contact.first_name ? undefined : editedContact.first_name.trim(),
          last_name: editedContact.last_name.trim() === contact.last_name ? undefined : editedContact.last_name.trim(),
          email: editedContact.email.trim() === contact.email ? undefined : editedContact.email.trim(),
          phone_number: editedContact.phone_number.trim() === contact.phone_number ? undefined : editedContact.phone_number.trim()
        };

        const response = await fetch(`${apiUrl}/contacts/${contact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactEdits)
        });

        if (response.ok) {
          const updatedContact = (await response.json()).contact;
          onUpdate(updatedContact);
          setIsEditing(false);
          setUpdateError('');
        } else {
          const errorData = await response.json().catch(() => ({}));
          setUpdateError(errorData.message || `Failed to update contact (${response.status})`);
        }
      } catch (error) {
        setUpdateError('Network error: Unable to update contact');
        console.error('Error updating contact:', error);
      } finally {
        setUpdating(false);
      }
    };

    const handleDelete = async () => {
      if (!window.confirm(`Are you sure you want to delete ${contact.first_name} ${contact.last_name}?`)) {
        return;
      }

      setDeleting(true);
      try {
        const response = await fetch(`${apiUrl}/contacts/${contact.id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          onDelete(contact.id);
        } else {
          console.error('Failed to delete contact');
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
      } finally {
        setDeleting(false);
      }
    };

    const toggleHistory = () => {
      setShowHistory(!showHistory);
      if (!showHistory) {
        fetchHistory();
      }
    };

    const cancelEdit = () => {
      setEditedContact(contact);
      setIsEditing(false);
      setUpdateError('');
    };

    if (isEditing) {
      return (
        <div className="contact-card editing">
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              value={editedContact.first_name}
              onChange={(e) => setEditedContact({...editedContact, first_name: e.target.value})}
              disabled={updating}
            />
          </div>

          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              value={editedContact.last_name}
              onChange={(e) => setEditedContact({...editedContact, last_name: e.target.value})}
              disabled={updating}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={editedContact.email}
              onChange={(e) => setEditedContact({...editedContact, email: e.target.value})}
              disabled={updating}
            />
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              value={editedContact.phone_number}
              onChange={(e) => setEditedContact({...editedContact, phone_number: e.target.value})}
              disabled={updating}
            />
          </div>

          {updateError && (
            <div className="error-message">
              ⚠️ {updateError}
            </div>
          )}

          <div className="button-group">
            <button
              onClick={handleSubmitEdit}
              className="submit-btn"
              disabled={updating}
            >
              {updating ? (
                <span className="loading-spinner">
                  <span className="spinner"></span>
                  Updating...
                </span>
              ) : (
                'Submit Edit'
              )}
            </button>
            <button
              onClick={cancelEdit}
              className="cancel-btn"
              disabled={updating}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="contact-card">
        <div className="contact-info">
          <h3>{contact.first_name} {contact.last_name}</h3>
          <p><strong>Email:</strong> {contact.email}</p>
          <p><strong>Phone:</strong> {contact.phone_number}</p>
        </div>

        <div className="contact-actions">
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            Edit
          </button>

          <button onClick={toggleHistory} className="history-btn">
            {showHistory ? 'Hide History' : 'View History'}
          </button>

          <button
            onClick={handleDelete}
            className="delete-btn"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        {showHistory && (
          <History
            history={history}
            loading={loadingHistory}
            />
        )}
      </div>
    );
  };

  export default ContactComponent;