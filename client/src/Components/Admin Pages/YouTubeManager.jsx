import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal, Button, Form } from "react-bootstrap";
import "./YouTubeManager.css";
import { Helmet } from "react-helmet-async";

const YouTubeManager = () => {
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    url: "",
    description: "",
    thumbnail: "",
  });

  const API = import.meta.env.VITE_API_BASE_URL;

  // Function to extract video ID from YouTube URL
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Function to get YouTube thumbnail URL
  const getYoutubeThumbnail = (url) => {
    const videoId = getYoutubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
  };

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/youtube`);
      // Add thumbnail URL to each video
      const videosWithThumbnails = res.data.map(video => ({
        ...video,
        thumbnail: video.thumbnail || getYoutubeThumbnail(video.url)
      }));
      setVideos(videosWithThumbnails);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideo = async () => {
    try {
      const { title, url } = newVideo;
      if (!title || !url) return toast.error("Title and URL are required");

      // Convert regular YouTube URL to embed URL if needed
      const videoData = {
        ...newVideo,
        // If it's not already an embed URL, convert it
        url: url.includes('youtube.com/embed/') ? url : 
             `https://www.youtube.com/embed/${getYoutubeId(url) || ''}`,
        // Add thumbnail if not provided
        thumbnail: newVideo.thumbnail || getYoutubeThumbnail(url)
      };

      const res = await axios.post(`${API}/api/admin/youtube`, videoData);
      setVideos((prev) => [res.data, ...prev]);
      setShowModal(false);
      setNewVideo({ title: "", url: "", description: "", thumbnail: "" });
      toast.success("Video added");
    } catch {
      toast.error("Failed to add video");
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/api/admin/youtube/${id}`);
    setVideos((prev) => prev.filter((v) => v._id !== id));
    toast.success("Deleted");
  };

  return (
    <>
      <Helmet>
        <title>Admin | Youtube Manager</title>
      </Helmet>
      <div className="container">
        <h2 className="text-white golden-heading p-4 mb-0">
          Unlocking Real Estate – Videos
        </h2>
        <Button
          variant="primary"
          className="mb-2 mt-0  m-4"
          onClick={() => setShowModal(true)}
        >
          + Add Video
        </Button>

        <div className="video-grid mt-4 ps-4">
          {videos.map((video) => (
            <div key={video._id} className="video-card">
              <div className="video-thumbnail" style={{
                backgroundImage: `url(${video.thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '200px',
                position: 'relative',
                cursor: 'pointer'
              }} onClick={() => window.open(video.url, '_blank')}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: '48px',
                  textShadow: '0 0 10px rgba(0,0,0,0.5)'
                }}>
                  ▶
                </div>
              </div>
              <h5 className="text-white">{video.title}</h5>
              <p className="text-white">{video.description}</p>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(video._id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>

        {/* Add Video Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add YouTube Video</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={newVideo.title}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>YouTube Embed URL</Form.Label>
                <Form.Control
                  value={newVideo.url}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, url: e.target.value })
                  }
                  placeholder="e.g. https://www.youtube.com/embed/abc123"
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={newVideo.description}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, description: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddVideo}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default YouTubeManager;
