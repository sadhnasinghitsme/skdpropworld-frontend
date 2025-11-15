const express = require('express');
const router = express.Router();
const News = require('../models/News');

// GET all visible news (public)
router.get('/', async (req, res) => {
  try {
    const news = await News.find({ visible: true })
      .sort({ date: -1 })
      .limit(20);
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
});

// GET all news including hidden (admin)
router.get('/admin/all', async (req, res) => {
  try {
    const news = await News.find()
      .sort({ date: -1 });
    res.json(news);
  } catch (error) {
    console.error('Error fetching all news:', error);
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
});

// GET single news by ID
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
});

// POST create new news (admin)
router.post('/', async (req, res) => {
  try {
    const { title, excerpt, content, image, link, visible, category } = req.body;

    if (!title || !excerpt || !content || !image) {
      return res.status(400).json({ message: 'Title, excerpt, content, and image are required' });
    }

    const news = new News({
      title,
      excerpt,
      content,
      image,
      link,
      visible: visible !== undefined ? visible : true,
      category: category || 'YEIDA Updates',
      date: new Date()
    });

    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Error creating news', error: error.message });
  }
});

// PUT update news (admin)
router.put('/:id', async (req, res) => {
  try {
    const { title, excerpt, content, image, link, visible, category } = req.body;

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      {
        title,
        excerpt,
        content,
        image,
        link,
        visible,
        category
      },
      { new: true, runValidators: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json(updatedNews);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Error updating news', error: error.message });
  }
});

// DELETE news (admin)
router.delete('/:id', async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    
    if (!deletedNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json({ message: 'News deleted successfully', deletedNews });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Error deleting news', error: error.message });
  }
});

// PATCH toggle visibility (admin)
router.patch('/:id/toggle-visibility', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    news.visible = !news.visible;
    await news.save();

    res.json(news);
  } catch (error) {
    console.error('Error toggling visibility:', error);
    res.status(500).json({ message: 'Error toggling visibility', error: error.message });
  }
});

module.exports = router;
