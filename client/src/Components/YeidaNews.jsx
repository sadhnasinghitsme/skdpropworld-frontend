import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Modal, Button } from 'react-bootstrap';
import './YeidaNews.css';

const YeidaNews = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/news`);
        const data = await response.json();
        setNews(data.slice(0, 6)); // Show latest 6 news
      } catch (error) {
        console.error('Error fetching news:', error);
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
    <section className="yeida-news-section">
      <Container>
        <div className="news-header">
          <h1 className="news-title">
            <i className="fas fa-newspaper me-3"></i>
            Latest YEIDA News & Updates
          </h1>
          <p className="news-subtitle">Stay updated with the latest developments in YEIDA region</p>
        </div>

        <Row className="g-4">
          {news.map((item) => (
            <Col lg={4} md={6} key={item._id}>
              <Card className="news-card h-100">
                <div className="news-image-wrapper">
                  <Card.Img 
                    variant="top" 
                    src={item.image || '/placeholder-news.jpg'} 
                    alt={item.title}
                    className="news-image"
                  />
                  <div className="news-badge">
                    <i className="fas fa-clock me-1"></i>
                    {new Date(item.date).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="news-card-title">{item.title}</Card.Title>
                  <Card.Text className="news-excerpt">
                    {item.excerpt || item.content?.substring(0, 120) + '...'}
                  </Card.Text>
                  <button 
                    onClick={() => handleReadMore(item)} 
                    className="read-more-link mt-auto"
                    style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    Read Full Article <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {news.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted">No news available at the moment.</p>
          </div>
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
                className="w-100 rounded mb-3"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
              <div className="d-flex align-items-center gap-3 mb-3 text-muted">
                <span>
                  <i className="fas fa-calendar me-2"></i>
                  {new Date(selectedNews.date).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
                <span className="badge bg-primary">{selectedNews.category}</span>
              </div>
              <div className="news-content" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                {selectedNews.content}
              </div>
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


