const express = require('express');
const musicController = require('../controllers/music.controller');
const authMiddleware = require('../middlewares/authmiddleware');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Artist only
router.post('/upload', authMiddleware.authArtist, upload.single('music'), musicController.createMusic);
router.post('/album', authMiddleware.authArtist, musicController.createAlbum);

// Any logged-in person (artist or user)
router.get('/', authMiddleware.authAny, musicController.getAllMusics);
router.get('/albums', authMiddleware.authAny, musicController.getAllAlbums);
router.get('/albums/:albumId', authMiddleware.authAny, musicController.getAllalbumById);

module.exports = router;
