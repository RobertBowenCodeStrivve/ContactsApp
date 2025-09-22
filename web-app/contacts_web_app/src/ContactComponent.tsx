import React, { useState } from 'react';
import type { Contact, ContactHistory } from './types';
import {History} from './History';
  interface ContactProps {
    contact: Contact;
    onUpdate: (contact: Contact) => void;
    onDelete: (contactId: string) => void;
  }

  const ContactComponent: React.FC<ContactProps> = ({ contact, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContact, setEditedContact] = useState(contact);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<ContactHistory[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState('');

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
          setHistory([]); //clear history to force refetch
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

    const fetchHistory = async () => {
      if (history.length === 0) {
        setLoadingHistory(true);
        try {
          const response = await fetch(`${apiUrl}/contactsHistory/${contact.id}`);
          if (response.ok) {
            const historyData = (await response.json()).history;
            setHistory(historyData);
          }
        } catch (error) {
          console.error('Error fetching history:', error);
        } finally {
          setLoadingHistory(false);
        }
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