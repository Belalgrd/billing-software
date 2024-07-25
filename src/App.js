import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import SignatureCanvas from 'react-signature-canvas';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignature, setShowSignature] = useState(false);
  const sigCanvas = useRef(null);
  const invoiceNumber = uuidv4().slice(0, 8);
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    const handleBeforePrint = () => {
      document.querySelectorAll('.no-print').forEach((el) => el.classList.add('hidden-print'));
    };

    const handleAfterPrint = () => {
      document.querySelectorAll('.no-print').forEach((el) => el.classList.remove('hidden-print'));
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  const handleAddItem = (event) => {
    event.preventDefault();
    if (itemName && itemPrice && itemQuantity) {
      const newItem = {
        id: uuidv4(),
        name: itemName,
        price: parseFloat(itemPrice),
        quantity: parseInt(itemQuantity, 10),
        total: parseFloat(itemPrice) * parseInt(itemQuantity, 10),
      };
      setItems([...items, newItem]);
      setItemName('');
      setItemPrice('');
      setItemQuantity('');
      setErrorMessage('');
    } else {
      setErrorMessage('Please fill in all fields');
    }
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClearSignature = () => {
    sigCanvas.current.clear();
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">Billing Software</h1>
      <Row className="mb-3">
        <Col md={6}><strong>Invoice Number:</strong> {invoiceNumber}</Col>
        <Col md={6} className="text-right"><strong>Date:</strong> {currentDate}</Col>
      </Row>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleAddItem} className="mb-4 no-print">
        <Row>
          <Col md={4}>
            <Form.Group controlId="formItemName">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formItemPrice">
              <Form.Label>Item Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter item price"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formItemQuantity">
              <Form.Label>Item Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter item quantity"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="mt-3">
          Add Item
        </Button>
      </Form>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Price</th>
            <th>Item Quantity</th>
            <th>Total</th>
            <th className="no-print" > Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>Rs{item.price.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>Rs{item.total.toFixed(2)}</td>
              <td>
                <Button variant="danger" className="no-print" onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h3 className="text-right">Total: Rs: {calculateTotal()}</h3>
      <Button variant="success" onClick={() => setShowSignature(true)} className="no-print">
        Add Signature
      </Button>
      {showSignature && (
        <div className="signature-container print">
          <SignatureCanvas
            penColor="black"
            ref={sigCanvas}
            canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
          />
          <div className="signature-buttons">
            <Button variant="warning" className="no-print" onClick={handleClearSignature}>
              Clear
            </Button>
            <Button variant="primary" className="no-print" onClick={handlePrint}>
              Print Bill
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}

export default App;
