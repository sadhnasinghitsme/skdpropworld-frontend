import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import './YeidaNews.css';

const YeidaNews = () => {
  const [news, setNews] = useState([]);
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

  return (
    <section className="yeida-news-section">
      <Container>
        <div className="news-header">
          <h2 className="news-title">
            <i className="fas fa-newspaper me-3"></i>
            Latest YEIDA News & Updates
          </h2>
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
                  <a href={item.link || '#'} className="read-more-link mt-auto" target="_blank" rel="noopener noreferrer">
                    Read Full Article <i className="fas fa-arrow-right ms-2"></i>
                  </a>
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
    </section>
  );
};

export default YeidaNews;


