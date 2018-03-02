import passport from 'passport';

import { Router } from 'express';

const router = Router();

router.get("/unprotected", function (req, res) {
  res.json({"message": "Hello from the /api/unprotected GET endpoint"});
});

router.get("/protected", passport.authenticate('jwt', { session: false }), function (req, res) {
  res.json({"message": "Hello from the /api/protected GET endpoint"});
});

export default router;