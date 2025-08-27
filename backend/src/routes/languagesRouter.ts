import { Router } from 'express';
import {
  getAllLanguages,
  getDefaultLanguage
} from '../controllers/languagesController';

const router = Router();

router.get('/', getAllLanguages);
router.get('/default', getDefaultLanguage);

export default router;
