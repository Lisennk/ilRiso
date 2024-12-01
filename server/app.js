const express = require('express');
const cors = require('cors');
const stateRouter = require('./routes/state');
const config = require('config');
const appPort = config.get('port');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/state', stateRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = appPort || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
