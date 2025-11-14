import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.get('/', (req, res) => {
  res.json({ message: 'Recipe Management API - PostgreSQL' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
