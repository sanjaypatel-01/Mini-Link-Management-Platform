// import express from 'express';
// import { nanoid } from 'nanoid';
// import Url from '../models/UrlModel.js';
// import { authenticateToken } from '../middleware/AuthenticateToken.js';
// import { createShortLink, getShortLinks, deleteShortLink, updateShortLink, redirectShortLink } from '../controllers/UrlController.js';
// import { redirectToOriginalUrl } from '../controllers/ShortLinkController.js';

// const router = express.Router();

// router.post('/create', authenticateToken, createShortLink);
// router.get('/', authenticateToken, getShortLinks);
// router.delete('/:id', authenticateToken, deleteShortLink);
// router.put('/:id', authenticateToken, updateShortLink);
// router.get('/:shortId', redirectShortLink);
// router.get('/:shortId', redirectToOriginalUrl);

// export default router;