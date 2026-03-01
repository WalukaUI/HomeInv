// import React, { useState } from 'react';
// import { Form, Button, Row, Col, Card, Alert, InputGroup } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import { createItem } from '../services/api';

// // Sample image suggestions - you can expand this list
// const IMAGE_SUGGESTIONS = [
//   {
//     name: 'Raspberry Pi',
//     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Raspberry_Pi_Zero_W_bare.jpg/800px-Raspberry_Pi_Zero_W_bare.jpg',
//     thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Raspberry_Pi_Zero_W_bare.jpg/200px-Raspberry_Pi_Zero_W_bare.jpg'
//   },
//   {
//     name: 'Arduino Uno',
//     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Arduino_Uno_-_R3.jpg/800px-Arduino_Uno_-_R3.jpg',
//     thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Arduino_Uno_-_R3.jpg/200px-Arduino_Uno_-_R3.jpg'
//   },
//   {
//     name: 'ESP8266',
//     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/ESP8266-01_module_-_FRONT.jpg/800px-ESP8266-01_module_-_FRONT.jpg',
//     thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/ESP8266-01_module_-_FRONT.jpg/200px-ESP8266-01_module_-_FRONT.jpg'
//   },
//   {
//     name: 'Breadboard',
//     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Breadboard_400.jpg/800px-Breadboard_400.jpg',
//     thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Breadboard_400.jpg/200px-Breadboard_400.jpg'
//   },
//   {
//     name: 'LED',
//     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/LED_%28red%29.jpg/800px-LED_%28red%29.jpg',
//     thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/LED_%28red%29.jpg/200px-LED_%28red%29.jpg'
//   },
//   {
//     name: 'Sensor',
//     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/DHT22_sensor.jpg/800px-DHT22_sensor.jpg',
//     thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/DHT22_sensor.jpg/200px-DHT22_sensor.jpg'
//   }
// ];

// function AddItemPage() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     item_name: '',
//     item_location: '',
//     date: '',
//     image_url: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [filteredSuggestions, setFilteredSuggestions] = useState([]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Filter image suggestions when typing in item_name
//     if (name === 'item_name' && value.length > 1) {
//       const filtered = IMAGE_SUGGESTIONS.filter(suggestion =>
//         suggestion.name.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredSuggestions(filtered);
//       setShowSuggestions(true);
//     } else if (name === 'item_name' && value.length <= 1) {
//       setShowSuggestions(false);
//     }
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     alert('Image URL copied to clipboard!');
//   };

//   // Fixed: This is now a regular function, not a hook
//   const handleUseSuggestion = (suggestion) => {
//     setFormData(prev => ({
//       ...prev,
//       image_url: suggestion.url
//     }));
//     setShowSuggestions(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       // Validate required fields
//       if (!formData.item_name.trim()) {
//         throw new Error('Item name is required');
//       }

//       // Clean up data - remove empty fields
//       const cleanData = {
//         item_name: formData.item_name.trim(),
//         ...(formData.item_location.trim() && { item_location: formData.item_location.trim() }),
//         ...(formData.date && { date: formData.date }),
//         ...(formData.image_url.trim() && { image_url: formData.image_url.trim() })
//       };

//       await createItem(cleanData);
//       setSuccess('Item added successfully!');
      
//       // Reset form
//       setFormData({
//         item_name: '',
//         item_location: '',
//         date: '',
//         image_url: ''
//       });
      
//       // Redirect to search page after 2 seconds
//       setTimeout(() => {
//         navigate('/');
//       }, 2000);
//     } catch (err) {
//       setError(err.message || 'Failed to add item');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2 className="mb-4">➕ Add New Item</h2>
      
//       <Row>
//         <Col md={6}>
//           <Card>
//             <Card.Body>
//               <Form onSubmit={handleSubmit}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Item Name *</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="item_name"
//                     value={formData.item_name}
//                     onChange={handleInputChange}
//                     placeholder="Enter item name"
//                     required
//                     autoComplete="off"
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Location (Shelf)</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="item_location"
//                     value={formData.item_location}
//                     onChange={handleInputChange}
//                     placeholder="e.g., Workshop, Kitchen, Garage"
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleInputChange}
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Image URL</Form.Label>
//                   <InputGroup>
//                     <Form.Control
//                       type="url"
//                       name="image_url"
//                       value={formData.image_url}
//                       onChange={handleInputChange}
//                       placeholder="https://example.com/image.jpg"
//                     />
//                     {formData.image_url && (
//                       <Button 
//                         variant="outline-secondary"
//                         onClick={() => copyToClipboard(formData.image_url)}
//                       >
//                         📋 Copy
//                       </Button>
//                     )}
//                   </InputGroup>
//                   <Form.Text className="text-muted">
//                     Enter a URL or select from suggested images below
//                   </Form.Text>
//                 </Form.Group>

//                 {error && <Alert variant="danger">{error}</Alert>}
//                 {success && <Alert variant="success">{success}</Alert>}

//                 <Button variant="primary" type="submit" disabled={loading}>
//                   {loading ? 'Adding...' : 'Add Item'}
//                 </Button>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={6}>
//           {showSuggestions && (
//             <Card>
//               <Card.Header>
//                 <h5>📸 Suggested Images for "{formData.item_name}"</h5>
//               </Card.Header>
//               <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
//                 <Row>
//                   {filteredSuggestions.length > 0 ? (
//                     filteredSuggestions.map((suggestion, index) => (
//                       <Col key={index} xs={6} className="mb-3">
//                         <Card>
//                           <Card.Img 
//                             variant="top" 
//                             src={suggestion.thumbnail} 
//                             style={{ height: '100px', objectFit: 'cover' }}
//                           />
//                           <Card.Body className="p-2">
//                             <Card.Title style={{ fontSize: '14px' }}>
//                               {suggestion.name}
//                             </Card.Title>
//                             <div className="d-flex gap-2">
//                               <Button 
//                                 size="sm" 
//                                 variant="primary"
//                                 onClick={() => handleUseSuggestion(suggestion)}
//                               >
//                                 Use
//                               </Button>
//                               <Button 
//                                 size="sm" 
//                                 variant="outline-secondary"
//                                 onClick={() => copyToClipboard(suggestion.url)}
//                               >
//                                 📋 Copy URL
//                               </Button>
//                             </div>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     ))
//                   ) : (
//                     <Col>
//                       <p className="text-muted">No suggestions found. Try typing a different item name.</p>
//                     </Col>
//                   )}
//                 </Row>
//               </Card.Body>
//             </Card>
//           )}

//           {/* Preview of current image */}
//           {formData.image_url && (
//             <Card className="mt-3">
//               <Card.Header>Preview</Card.Header>
//               <Card.Body>
//                 <img 
//                   src={formData.image_url} 
//                   alt="Preview" 
//                   style={{ maxWidth: '100%', maxHeight: '200px' }}
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = 'https://via.placeholder.com/200?text=Image+Not+Found';
//                   }}
//                 />
//               </Card.Body>
//             </Card>
//           )}
//         </Col>
//       </Row>
//     </div>
//   );
// }

// export default AddItemPage;





import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../services/api';

function AddItemPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item_name: '',
    item_location: '',
    date: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.item_name.trim()) {
      errors.item_name = 'Item name is required';
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Image URL copied to clipboard!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    setValidationErrors({});

    try {
      // Clean up data - ONLY send fields that have values
      const cleanData = {
        item_name: formData.item_name.trim()
      };
      
      // Only add optional fields if they have values
      if (formData.item_location.trim()) {
        cleanData.item_location = formData.item_location.trim();
      }
      
      if (formData.date) {
        cleanData.date = formData.date;
      }
      
      if (formData.image_url.trim()) {
        cleanData.image_url = formData.image_url.trim();
      }

      console.log('Sending to API:', cleanData);

      const response = await createItem(cleanData);
      console.log('API Response:', response);
      
      setSuccess('Item added successfully!');
      
      // Reset form
      setFormData({
        item_name: '',
        item_location: '',
        date: '',
        image_url: ''
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      console.error('Full error object:', err);
      
      if (err.response && err.response.data) {
        setError(err.response.data.error || `Server error: ${err.response.status}`);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to add item. Check console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">➕ Add New Item</h2>
      
      <Row>
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Item Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleInputChange}
                    placeholder="Enter item name"
                    required
                    isInvalid={!!validationErrors.item_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.item_name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location (Shelf)</Form.Label>
                  <Form.Control
                    type="text"
                    name="item_location"
                    value={formData.item_location}
                    onChange={handleInputChange}
                    placeholder="e.g., Workshop, Kitchen, Garage"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.image_url && (
                      <Button 
                        variant="outline-secondary"
                        onClick={() => copyToClipboard(formData.image_url)}
                      >
                        📋 Copy
                      </Button>
                    )}
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Optional: Add a URL to an image of the item
                  </Form.Text>
                </Form.Group>

                {error && (
                  <Alert variant="danger" onClose={() => setError('')} dismissible>
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                  </Alert>
                )}
                
                {success && <Alert variant="success">{success}</Alert>}

                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Item'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} lg={6}>
          {/* Image Preview Section
          {formData.image_url && (
            <Card>
              <Card.Header>Image Preview</Card.Header>
              <Card.Body>
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200?text=Image+Not+Found';
                  }}
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <small className="text-muted">
                      URL: {formData.image_url.substring(0, 50)}...
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>
          )} */}
        </Col>
      </Row>
    </div>
  );
}

export default AddItemPage;




