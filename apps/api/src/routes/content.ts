import { Router } from 'express';
import { query } from '../db/pool.js';
import { isResourceName, resources, selectList } from '../resources.js';
import { getSettings } from '../services/settings.js';

/** Lecture publique du contenu publié, utilisée par le site. */
export const contentRouter = Router();

contentRouter.get('/settings', async (_req, res) => {
  res.json({ data: await getSettings() });
});

contentRouter.get('/:resource', async (req, res, next) => {
  const name = req.params.resource;
  if (!isResourceName(name)) return next();
  const resource = resources[name];
  const rows = await query(
    `SELECT ${selectList(resource)} FROM ${resource.table} WHERE published ORDER BY ${resource.orderBy}`,
  );
  res.json({ data: rows });
});
