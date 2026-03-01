import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav } from 'react-bootstrap';

// Import page components (we'll create these next)
import SearchPage from './pages/SearchPage';
import ShelvesPage from './pages/ShelvesPage';
import AddItemPage from './pages/AddItemPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">📦 Pi Inventory</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">🔍 Search Items</Nav.Link>
                <Nav.Link as={Link} to="/shelves">📚 Shelves</Nav.Link>
                <Nav.Link as={Link} to="/add">➕ Add Item</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/shelves" element={<ShelvesPage />} />
            <Route path="/shelves/:location" element={<ShelvesPage />} />
            <Route path="/add" element={<AddItemPage />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;