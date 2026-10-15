import type { ErrorRequestHandler, RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Ressource introuvable' });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  // Corps JSON illisible : erreur du client, pas du serveur
  if (error?.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Requête invalide' });
    return;
  }
  console.error(error);
  res.status(500).json({ error: 'Erreur interne du serveur' });
};
