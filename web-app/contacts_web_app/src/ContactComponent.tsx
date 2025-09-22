import React, { useState } from 'react';
import type { Contact, ContactHistory } from './types';

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
      setUpdateError('');

      try {
        const response = await fetch(`${apiUrl}/contacts/${contact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editedContact)
        });

        if (response.ok) {
          const updatedContact = await response.json();
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

    const fetchHistory = async () => {
      if (showHistory && history.length === 0) {
        setLoadingHistory(true);
        try {
          const response = await fetch(`http://localhost:3000/contactsHistory/${contact.id}`);
          if (response.ok) {
            const historyData = await response.json();
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
          <div className="contact-history">
            <h4>Contact History</h4>
            {loadingHistory ? (
              <p>Loading history...</p>
            ) : history.length > 0 ? (
              <ul>
                {history.map((item) => (
                  <li key={item.id} className="history-item">
                    <strong>{item.field_changed}</strong> changed from "{item.old_value}" to "{item.new_value}"
                    <span className="history-date">
                      {new Date(item.changed_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No history available</p>
            )}
          </div>
        )}
      </div>
    );
  };

  export default ContactComponent;