import React, { useState } from 'react';
import type { Contact } from './types';

  interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContactAdded: (contact: Contact) => void;
  }

  const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onContactAdded }) => {
    const [newContact, setNewContact] = useState({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${apiUrl}/contacts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newContact)
        });

        if (response.ok) {
          const createdContact = (await response.json()).contact;
          onContactAdded(createdContact);
          setNewContact({ first_name: '', last_name: '', email: '', phone_number: '' });
          onClose();
        } else {
          setError('Failed to create contact');
        }
      } catch (error) {
        setError('Error creating contact');
        console.error('Error creating contact:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleClose = () => {
      if (!loading) {
        setNewContact({ first_name: '', last_name: '', email: '', phone_number: '' });
        setError('');
        onClose();
      }
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Add New Contact</h2>
            <button onClick={handleClose} className="close-btn" disabled={loading}>
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                value={newContact.first_name}
                onChange={(e) => setNewContact({...newContact, first_name: e.target.value})}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                value={newContact.last_name}
                onChange={(e) => setNewContact({...newContact, last_name: e.target.value})}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                value={newContact.phone_number}
                onChange={(e) => setNewContact({...newContact, phone_number: e.target.value})}
                required
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="loading-spinner">
                    <span className="spinner"></span>
                    Creating...
                  </span>
                ) : (
                  'Create Contact'
                )}
              </button>
              <button type="button" onClick={handleClose} className="cancel-btn" disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default AddContactModal;