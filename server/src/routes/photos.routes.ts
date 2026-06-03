import { Router } from 'express';
import { getPhotos } from '../controllers/photos.controller.js';

const router = Router();

router.get('/', getPhotos);

export default router;
