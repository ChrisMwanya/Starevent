import { createApp } from './app.js';
import { env } from './config/env.js';
import { migrate } from './db/migrate.js';

await migrate();

createApp().listen(env.PORT, () => {
  console.info(`API Star Event démarrée sur http://localhost:${env.PORT}`);
});
