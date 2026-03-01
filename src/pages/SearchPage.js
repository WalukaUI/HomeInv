import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Button, Modal, Alert } from 'react-bootstrap';
import { getItems, updateItem, deleteItem } from '../services/api';

function SearchPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    item_name: '',
    item_location: '',
    date: '',
    image_url: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    // Filter items based on search term
    const filtered = items.filter(item =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.item_location && item.item_location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await getItems();
      setItems(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch items. Make sure your Pi API is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        setItems(items.filter(item => item.id !== id));
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      item_name: item.item_name,
      item_location: item.item_location || '',
      date: item.date || '',
      image_url: item.image_url || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      await updateItem(editingItem.id, editForm);
      setShowEditModal(false);
      fetchItems(); // Refresh list
    } catch (err) {
      alert('Failed to update item');
    }
  };

  if (loading) return <div className="text-center">Loading items...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2 className="mb-4">🔍 Search Items</h2>
      
      <Form className="mb-4">
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Search by item name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
      </Form>

      <Row>
        {filteredItems.map(item => (
  <Col key={item.id} md={4} lg={3} className="mb-3">
    <Card className="h-100">
      {item.image_url ? (
        <div style={{ height: '150px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
          <Card.Img 
            variant="top" 
            src={item.image_url} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x150?text=Image+Not+Found';
            }}
          />
        </div>
      ) : (
        <div 
          style={{ 
            height: '150px', 
            backgroundColor: '#e9ecef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6c757d'
          }}
        >
          <span>No Image</span>
        </div>
      )}
      <Card.Body>
        <Card.Title>{item.item_name}</Card.Title>
        <Card.Text>
          <strong>Location:</strong> {item.item_location || 'Not specified'}<br />
          <strong>Date:</strong> {item.date || 'Not set'}<br />
          {item.image_url && (
            <small className="text-muted">
              <a href={item.image_url} target="_blank" rel="noopener noreferrer">View Image</a>
            </small>
          )}
        </Card.Text>
        <div className="d-flex gap-2">
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => handleEdit(item)}
          >
            ✏️ Edit
          </Button>
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={() => handleDelete(item.id)}
          >
            🗑️ Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  </Col>
))}
      </Row>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Item Name *</Form.Label>
              <Form.Control
                type="text"
                value={editForm.item_name}
                onChange={(e) => setEditForm({...editForm, item_name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={editForm.item_location}
                onChange={(e) => setEditForm({...editForm, item_location: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm({...editForm, date: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                value={editForm.image_url}
                onChange={(e) => setEditForm({...editForm, image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SearchPage;