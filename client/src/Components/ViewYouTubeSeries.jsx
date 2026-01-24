import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaYoutube, FaArrowRight, FaArrowLeft, FaPlay } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import './ViewYouTubeSeries.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Function to convert YouTube URLs to embed format
const getEmbedUrl = (url) => {
  if (!url) return '';
  
  try {
    // If it's already an embed URL, return as is
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    let videoId = '';
    
    // Handle youtu.be short URLs (https://youtu.be/VIDEO_ID)
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split(/[?&#]/)[0];
    } 
    // Handle watch URLs (https://www.youtube.com/watch?v=VIDEO_ID)
    else if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v');
    }
    // Handle youtu.be with additional parameters
    else if (url.includes('youtube.com/embed/')) {
      const parts = url.split('youtube.com/embed/');
      videoId = parts[1].split(/[?&#]/)[0];
    }
    
    // If we have a valid video ID, return the embed URL
    if (videoId && videoId.length === 11) {
      return `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&enablejsapi=1`;
    }
    
    console.warn('Could not extract YouTube video ID from URL:', url);
    return '';
  } catch (error) {
    console.error('Error processing YouTube URL:', url, error);
    return '';
  }
};

const ViewYouTubeSeries = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const scrollContainerRef = useRef(null);

  // Function to handle scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  // Function to handle scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE}/api/admin/youtube`);
        
        if (response.data && response.data.length > 0) {
          // Process videos to ensure they have all required fields
          const processedVideos = response.data.map(video => ({
            ...video,
            url: getEmbedUrl(video.url),
            thumbnail: video.thumbnail || `https://img.youtube.com/vi/${getYoutubeId(video.url)}/hqdefault.jpg`
          }));
          setVideos(processedVideos);
        } else {
          setError('No videos found. Please check back later.');
          setVideos([]);
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Function to extract YouTube video ID from URL
  const getYoutubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="youtube-series-section py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="youtube-series-section py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Helmet>
        <title>Unlocking Real Estate | SKD Prop World</title>
        <meta name="description" content="Watch our YouTube series on real estate investment and market trends" />
      </Helmet>
      
      <div className="container">
        <div className="row align-items-center">
          {/* Left Column - Podcast Info */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="pe-lg-4">
              <FaYoutube className="text-danger mb-3" style={{ fontSize: '2.5rem' }} />
              <h2 className="mb-3">
                Unlocking <span className="text-primary">Real Estate</span>
              </h2>
              <p className="lead mb-3">A show which helps you invest wisely</p>
              <p className="text-muted mb-4">
                Dive into real stories, trends, and secrets shaping the world of real estate. 
                Your property journey starts here with unlocking real estate!
              </p>
              <a 
                href="https://www.youtube.com/channel/UCBqqQkxHtycbgChxmW_JwAA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-danger d-inline-flex align-items-center"
              >
                Visit Channel <FaArrowRight className="ms-2" />
              </a>
            </div>
          </div>
          
          {/* Right Column - Video Carousel */}
          <div className="col-lg-8 position-relative">
            {error && (
              <div className="alert alert-warning mb-4">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}
            
            {!loading && videos.length === 0 && !error && (
              <div className="text-center py-5">
                <i className="bi bi-film fs-1 text-muted mb-3 d-block"></i>
                <h4>No videos available</h4>
                <p className="text-muted">Check back later for new content</p>
              </div>
            )}
            
            {videos.length > 0 ? (
              <div className="position-relative">
                <div 
                  ref={scrollContainerRef}
                  className="scroll-container"
                  style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '20px',
                    padding: '20px 0',
                    scrollBehavior: 'smooth',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none'
                  }}
                >
                  {videos.map((video) => (
                    <div 
                      key={video._id} 
                      className="video-card"
                      style={{
                        flex: '0 0 auto',
                        width: '300px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                      }}
                    >
                      <div 
                        className="video-thumbnail position-relative"
                        style={{
                          paddingTop: '56.25%',
                          backgroundImage: `url(${video.thumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedVideo(video)}
                      >
                        <div 
                          className="play-button"
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '60px',
                            height: '60px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ff0000',
                            fontSize: '24px',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <FaPlay />
                        </div>
                      </div>
                      <div className="p-3">
                        <h5 className="mb-1" style={{ fontSize: '1rem', fontWeight: '600' }}>
                          {video.title}
                        </h5>
                        {video.description && (
                          <p className="text-muted small mb-0">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  className="btn btn-link position-absolute start-0 top-50 translate-middle-y d-none d-lg-flex align-items-center justify-content-center"
                  style={{
                    left: '-20px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
                    border: 'none',
                    zIndex: 2
                  }}
                  onClick={scrollLeft}
                >
                  <FaArrowLeft />
                </button>
                
                <button 
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y d-none d-lg-flex align-items-center justify-content-center"
                  style={{
                    right: '-20px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
                    border: 'none',
                    zIndex: 2
                  }}
                  onClick={scrollRight}
                >
                  <FaArrowRight />
                </button>
              </div>
            ) : (
              <div className="alert alert-info">No videos available at the moment. Please check back later.</div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.8)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" style={{ marginTop: '2rem' }}>
            <div className="modal-content border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title">{selectedVideo.title}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedVideo(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="ratio ratio-16x9">
                  <iframe
                    src={getEmbedUrl(selectedVideo.url) + '&autoplay=1'}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 'none' }}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ViewYouTubeSeries;
