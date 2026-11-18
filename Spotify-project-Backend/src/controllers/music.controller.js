const mongoose = require('mongoose');
const musicModel = require('../models/music.model');
const albumModel = require('../models/album.model');
const { uploadFile } = require('../services/storage.service');

async function createMusic(req, res) {
    const { title } = req.body;
    const file = req.file;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    if (!file) {
        return res.status(400).json({ message: 'File is required' });
    }

    const result = await uploadFile(file.buffer.toString('base64'));

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id
    });

    res.status(201).json({
        message: 'Music created successfully',
        music: {
            id: music.id,
            uri: music.uri,
            title: music.title,
            artist: music.artist
        }
    });
}

async function createAlbum(req, res) {
    const { title, musics } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Album title is required' });
    }
    if (!Array.isArray(musics) || musics.length === 0) {
        return res.status(400).json({ message: 'Pick at least one song' });
    }

    const album = await albumModel.create({
        title,
        artist: req.user.id,
        musics
    });

    res.status(201).json({
        message: 'Album created successfully',
        album: {
            id: album._id,
            title: album.title,
            artist: album.artist,
            musics: album.musics
        }
    });
}

async function getAllMusics(req, res) {
    // populate swaps the artist id for { _id, name } so the frontend can show/search the name
    const musics = await musicModel.find().populate('artist', 'name');

    res.status(200).json({
        message: 'All musics fetched successfully',
        musics
    });
}

async function getAllAlbums(req, res) {
    const albums = await albumModel.find().select('title artist').populate('artist', 'name email');

    res.status(200).json({
        message: 'All albums fetched successfully',
        albums
    });
}

async function getAllalbumById(req, res) {
    const { albumId } = req.params;

    if (!mongoose.isValidObjectId(albumId)) {
        return res.status(400).json({ message: 'Invalid album id' });
    }

    const album = await albumModel
        .findById(albumId)
        .populate('artist', 'name email')
        .populate({ path: 'musics', populate: { path: 'artist', select: 'name' } });

    if (!album) {
        return res.status(404).json({ message: 'Album not found' });
    }

    res.status(200).json({
        message: 'Album fetched successfully',
        album
    });
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAllalbumById };
