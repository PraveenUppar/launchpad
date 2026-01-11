import app from './app.js';
import { startTracing } from './observability/tracing';

const PORT = 3000;

(async () => {
  await startTracing();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down.');
  process.exit(0);
});
