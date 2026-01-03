import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaYoutube, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Helmet } from "react-helmet-async";

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
    // Handle embed URLs (should be caught by first condition)
    // Handle youtu.be with additional parameters
    else if (url.includes('youtube.com/embed/')) {
      const parts = url.split('youtube.com/embed/');
      videoId = parts[1].split(/[?&#]/)[0];
    }
    // Handle youtu.be with additional parameters
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split(/[?&#]/)[0];
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
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
        const response = await axios.get(`${API_BASE}/api/admin/youtube`);
        
        if (!Array.isArray(response.data)) {
          console.error('Invalid response format:', response.data);
          throw new Error('Invalid response from server');
        }
        
        // Filter for valid videos and only those related to YEIDA or Greater Noida
        const validVideos = response.data.filter(video => {
          if (!video || !video.url || !video.title || typeof video.title !== 'string' || typeof video.url !== 'string') {
            return false;
          }
          
          // Check if title or description contains location keywords (case insensitive)
          const locationKeywords = ['yeida', 'greater noida', 'noida extension', 'yamuna expressway'];
          const title = video.title.toLowerCase();
          const description = (video.description || '').toLowerCase();
          
          return locationKeywords.some(keyword => 
            title.includes(keyword) || 
            description.includes(keyword)
          );
        });
        
        if (validVideos.length === 0) {
          console.warn('No location-specific videos found');
          setError('No videos available for the selected locations (YEIDA/Greater Noida) at the moment.');
        } else {
          setError(null);
        }
        
        setVideos(validVideos);
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

  if (loading) {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="alert alert-warning">{error}</div>
      </div>
    );
  }

  return (
    <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row align-items-center">
          {/* Left Column - Podcast Info */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="pe-lg-4">
              <FaYoutube className="text-danger mb-3" style={{ fontSize: '2.5rem' }} />
              <h2 className="mb-3">
                Exclusive <span className="text-primary">Real Estate</span> Podcast
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
                className="btn btn-primary"
              >
                Visit Channel <FaArrowRight className="ms-2" />
              </a>
            </div>
          </div>
          
          {/* Right Column - Video Carousel */}
          <div className="col-lg-8 position-relative">
            <button 
              className="btn btn-link position-absolute start-0 top-50 translate-middle-y z-3 d-none d-lg-block"
              style={{left: '-20px'}}
              onClick={() => sliderRef.current.slickPrev()}
            >
              <div className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                <FaArrowLeft />
              </div>
            </button>
            
            <Slider ref={sliderRef} {...settings}>
              {videos.map((video) => (
                <div key={video._id} className="px-2">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="ratio ratio-16x9">
                      <iframe
                        src={getEmbedUrl(video.url)}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-top"
                      ></iframe>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title" style={{fontSize: '1rem'}}>
                        {video.title.length > 50 ? `${video.title.substring(0, 50)}...` : video.title}
                      </h5>
                      {video.description && (
                        <p className="card-text small text-muted">
                          {video.description.length > 80 
                            ? `${video.description.substring(0, 80)}...` 
                            : video.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
            
            <button 
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y z-3 d-none d-lg-block"
              style={{right: '-20px'}}
              onClick={() => sliderRef.current.slickNext()}
            >
              <div className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                <FaArrowRight />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewYouTubeSeries;
