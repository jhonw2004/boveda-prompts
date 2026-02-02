import express from 'express';
import passport from '../config/passport.js';
import { googleCallback } from '../controladores/oauthControlador.js';

const router = express.Router();

// Iniciar autenticación con Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

// Callback de Google
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/iniciar-sesion?error=auth_failed`
  }),
  googleCallback
);

export default router;
