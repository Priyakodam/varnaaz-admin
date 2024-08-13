import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { db } from '../Firebase/FirebaseConfig'; // Import Firebase configuration
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods

const AddRoleModal = ({ show, handleClose }) => {
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (role.trim() === '') {
      setError('Role cannot be empty');
      return;
    }

    try {
      // Add the role to the "roles" collection in Firestore
      const rolesCollection = collection(db, 'roles');
      await addDoc(rolesCollection, { name: role.trim() });
      window.alert('Role added successfully!');

      console.log('Role added:', role);
      setRole(''); // Clear the input field
      setError(''); // Clear the error message
      handleClose(); // Close the modal
    } catch (err) {
      console.error('Error adding role to Firestore:', err);
      setError('Failed to add role. Please try again.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Role</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              isInvalid={!!error}
            />
            {error && (
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="secondary" onClick={handleClose}>
          Close
        </Button> */}
        <Button variant="primary" onClick={handleSave}>
          Save 
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddRoleModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddRoleModal;
