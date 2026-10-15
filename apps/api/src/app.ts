import path from 'node:path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { adminRouter } from './routes/admin.js';
import { contentRouter } from './routes/content.js';
import { healthRouter } from './routes/health.js';
import { quotesRouter } from './routes/quotes.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  // `credentials` : le back-office envoie son cookie de session
  app.use(cors({ origin: env.corsOrigins, credentials: true }));
  app.use(cookieParser());
  app.use(express.json({ limit: '100kb' }));

  // Images du back-office, affichées par le site (autre origine)
  app.use(
    '/uploads',
    helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }),
    express.static(path.resolve(env.UPLOADS_DIR), { maxAge: '30d', immutable: true, index: false }),
  );

  app.use('/health', healthRouter);
  app.use('/content', contentRouter);
  app.use('/quotes', quotesRouter);
  app.use('/admin', adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
