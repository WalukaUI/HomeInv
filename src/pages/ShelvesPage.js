import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Modal, Alert, Badge, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getItems, updateItem, deleteItem } from '../services/api';

function ShelvesPage() {
  const { location } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [shelves, setShelves] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(location || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Edit modal state (same as SearchPage)
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
    if (location) {
      setSelectedLocation(location);
    }
  }, [location]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await getItems();
      const allItems = response.data.data;
      setItems(allItems);
      
      // Group items by location
      const grouped = allItems.reduce((acc, item) => {
        const loc = item.item_location || 'Unspecified';
        if (!acc[loc]) {
          acc[loc] = {
            items: [],
            count: 0
          };
        }
        acc[loc].items.push(item);
        acc[loc].count++;
        return acc;
      }, {});
      
      setShelves(grouped);
      setError('');
    } catch (err) {
      setError('Failed to fetch items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        fetchItems(); // Refresh shelves
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
      fetchItems(); // Refresh shelves
    } catch (err) {
      alert('Failed to update item');
    }
  };

  if (loading) return <div className="text-center">Loading shelves...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  // If a specific location is selected, show its items
  if (selectedLocation) {
    const shelfItems = shelves[selectedLocation]?.items || [];
    
    return (
      <div>
        <Button 
          variant="link" 
          onClick={() => {
            setSelectedLocation(null);
            navigate('/shelves');
          }}
          className="mb-3"
        >
          ← Back to all shelves
        </Button>
        
        <h2 className="mb-4">📚 {selectedLocation} Shelf</h2>
        <p className="text-muted mb-4">{shelfItems.length} items in this location</p>
        
        <Row>
          {shelfItems.map(item => (
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
          <strong>Date:</strong> {item.date || 'Not set'}<br />
          <small className="text-muted">ID: {item.id}</small>
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

        {/* Edit Modal - same as SearchPage */}
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
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  // Otherwise, show all shelves
  return (
    <div>
      <h2 className="mb-4">📚 Shelves by Location</h2>
      
      <Row>
        {Object.entries(shelves).map(([location, data]) => (
          <Col key={location} md={4} className="mb-3">
            <Card 
              className="h-100"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedLocation(location);
                navigate(`/shelves/${encodeURIComponent(location)}`);
              }}
            >
              <Card.Body className="text-center">
                <Card.Title>{location}</Card.Title>
                <Badge bg="primary" className="mt-2">
                  {data.count} {data.count === 1 ? 'item' : 'items'}
                </Badge>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ShelvesPage;