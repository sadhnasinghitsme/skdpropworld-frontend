import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import './AdminNewsManager.css';

const AdminNewsManager = () => {
  const [news, setNews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    link: '',
    visible: true,
    category: 'YEIDA Updates'
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/news/admin/all`);
      setNews(response.data);
    } catch (error) {
      showAlert('Error fetching news', 'danger');
      console.error('Error:', error);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingNews) {
        await axios.put(`${API_BASE}/api/news/${editingNews._id}`, formData);
        showAlert('News updated successfully!', 'success');
      } else {
        await axios.post(`${API_BASE}/api/news`, formData);
        showAlert('News created successfully!', 'success');
      }
      
      fetchNews();
      handleCloseModal();
    } catch (error) {
      showAlert('Error saving news', 'danger');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news?')) return;

    try {
      await axios.delete(`${API_BASE}/api/news/${id}`);
      showAlert('News deleted successfully!', 'success');
      fetchNews();
    } catch (error) {
      showAlert('Error deleting news', 'danger');
      console.error('Error:', error);
    }
  };

  const toggleVisibility = async (id) => {
    try {
      await axios.patch(`${API_BASE}/api/news/${id}/toggle-visibility`);
      showAlert('Visibility toggled successfully!', 'success');
      fetchNews();
    } catch (error) {
      showAlert('Error toggling visibility', 'danger');
      console.error('Error:', error);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      excerpt: newsItem.excerpt,
      content: newsItem.content,
      image: newsItem.image,
      link: newsItem.link || '',
      visible: newsItem.visible,
      category: newsItem.category
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNews(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      link: '',
      visible: true,
      category: 'YEIDA Updates'
    });
  };

  return (
    <div className="admin-news-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="fas fa-newspaper me-2"></i>
          Manage YEIDA News
        </h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus me-2"></i>
          Add New News
        </Button>
      </div>

      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item._id}>
                <td>
                  <img src={item.image} alt={item.title} className="news-thumbnail" />
                </td>
                <td>{item.title}</td>
                <td>
                  <span className="badge bg-info">{item.category}</span>
                </td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${item.visible ? 'bg-success' : 'bg-secondary'}`}>
                    {item.visible ? 'Visible' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(item)}
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    variant={item.visible ? 'secondary' : 'success'}
                    size="sm"
                    className="me-2"
                    onClick={() => toggleVisibility(item._id)}
                  >
                    <i className={`fas fa-eye${item.visible ? '-slash' : ''}`}></i>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(item._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingNews ? 'Edit News' : 'Add New News'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="YEIDA Updates">YEIDA Updates</option>
                <option value="Market News">Market News</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Government Policies">Government Policies</option>
                <option value="General">General</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Excerpt *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL *</Form.Label>
              <Form.Control
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>External Link (Optional)</Form.Label>
              <Form.Control
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com/full-article"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Visible on website"
                checked={formData.visible}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : editingNews ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminNewsManager;
