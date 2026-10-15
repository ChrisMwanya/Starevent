import type { RequestHandler } from 'express';
import { env } from '../config/env.js';
import { findSessionAdmin, SESSION_COOKIE, type Admin } from '../services/auth.js';

declare module 'express-serve-static-core' {
  interface Request {
    admin?: Admin;
  }
}

/** Refuse les requêtes du back-office sans session valide. */
export const requireAdmin: RequestHandler = async (req, res, next) => {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  const admin = token ? await findSessionAdmin(token) : null;
  if (!admin) {
    res.status(401).json({ error: 'Session expirée, merci de vous reconnecter.' });
    return;
  }
  req.admin = admin;
  next();
};

/**
 * Protection CSRF : une requête qui modifie des données doit venir d'une origine autorisée.
 * Complète le cookie `SameSite=Lax`.
 */
export const requireTrustedOrigin: RequestHandler = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('origin');
  if (!origin || !env.corsOrigins.includes(origin)) {
    res.status(403).json({ error: 'Origine non autorisée' });
    return;
  }
  next();
};
