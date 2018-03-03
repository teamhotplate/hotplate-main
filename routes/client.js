import { Router, static as expressStatic } from 'express';
import path from 'path';

const router = Router();

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

export default router;