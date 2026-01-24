import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Modal, Button, Spinner, Alert } from 'react-bootstrap';
import './YeidaNews.css';

const YeidaNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (e) {
      return new Date().toLocaleDateString('en-IN');
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = API_BASE ? `${API_BASE}/api/news` : '/api/news';
        console.log('🔄 Fetching news from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.text();
            console.error('Error response:', errorData);
            errorData = JSON.parse(errorData);
          } catch (e) {
            console.error('Could not parse error response:', e);
          }
          throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('News data received:', data);

        // Transform the data to match the expected format
        const formattedNews = Array.isArray(data) 
          ? data.map(item => ({
              ...item,
              title: item.title || 'No Title',
              excerpt: item.excerpt || (item.content ? item.content.substring(0, 150) + '...' : 'No excerpt available'),
              content: item.content || 'No content available',
              image: item.image || '/placeholder-news.jpg',
              date: item.date || item.createdAt || new Date().toISOString()
            }))
          : [];
          
        setNews(formattedNews.slice(0, 6)); // Show latest 6 news
        setError(null);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(error.message || 'Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [API_BASE]);

  const handleReadMore = (newsItem) => {
    setSelectedNews(newsItem);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNews(null);
  };

  return (
    <section className="yeida-news-section py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-3">
            <i className="fas fa-newspaper me-2 text-primary"></i>
            Latest YEIDA News & Updates
          </h2>
          <p className="lead text-muted">Stay updated with the latest developments in YEIDA region</p>
        </div>

        {loading ? (
          <div className="text-center my-5 py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading latest news...</p>
          </div>
        ) : error ? (
          <div className="text-center my-5">
            <Alert variant="danger" className="d-inline-block">
              {error}
              <div className="mt-3">
                <Button
                  variant="outline-danger"
                  onClick={() => window.location.reload()}
                >
                  <i className="fas fa-sync-alt me-2"></i>Try Again
                </Button>
              </div>
            </Alert>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center my-5 py-5">
            <div className="py-4">
              <i className="far fa-newspaper text-muted" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
              <p className="mt-3 text-muted">No news available at the moment.</p>
            </div>
          </div>
        ) : (
          <Row className="g-4">
            {news.map((item) => (
              <Col lg={4} md={6} key={item._id || Math.random().toString(36).substr(2, 9)}>
                <Card className="h-100 shadow-sm border-0">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={item.image}
                      alt={item.title}
                      className="news-image"
                      style={{ height: '200px', objectFit: 'cover' }} />
                    <div className="position-absolute top-0 end-0 bg-primary text-white px-3 py-1 small">
                      {formatDate(item.date)}
                    </div>
                  </div>

                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fs-5 fw-bold mb-3">{item.title}</Card.Title>
                    <Card.Text className="text-muted mb-4 flex-grow-1">
                      {item.excerpt}
                    </Card.Text>
                    <Button
                      variant="outline-primary"
                      className="align-self-start"
                      onClick={() => handleReadMore(item)}
                    >
                      Read More <i className="fas fa-arrow-right ms-2"></i>
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* News Detail Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">{selectedNews?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNews && (
            <>
              <img 
                src={selectedNews.image} 
                alt={selectedNews.title}
                className="img-fluid rounded mb-4"
                style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
              />
              <div className="d-flex align-items-center gap-3 mb-4 text-muted">
                <span>
                  <i className="far fa-calendar-alt me-2"></i>
                  {formatDate(selectedNews.date)}
                </span>
                {selectedNews.category && (
                  <span className="badge bg-primary">{selectedNews.category}</span>
                )}
              </div>
              <div 
                className="news-content" 
                style={{ lineHeight: '1.8', fontSize: '1.05rem' }}
                dangerouslySetInnerHTML={{ __html: selectedNews.content }} 
              />
              {selectedNews.link && (
                <div className="mt-4">
                  <a 
                    href={selectedNews.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    <i className="fas fa-external-link-alt me-2"></i>
                    Read Original Article
                  </a>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default YeidaNews;
