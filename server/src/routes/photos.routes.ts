import { Router } from 'express';
import { getPhotos } from '../controllers/photos.controller.js';
import { likePhoto, unlikePhoto } from '../controllers/likes.controller.js';

const router = Router();

router.get('/', getPhotos);
router.put('/:id/like', likePhoto);
router.delete('/:id/like', unlikePhoto);

export default router;
