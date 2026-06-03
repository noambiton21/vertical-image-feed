import { Router } from 'express';
import photosRoutes from './photos.routes.js';

const router = Router();

router.use('/photos', photosRoutes);

export default router;
