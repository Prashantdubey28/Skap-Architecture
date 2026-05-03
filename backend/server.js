const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Controllers
const planRoutes = require('./routes/planRoutes');
const clientRoutes = require('./routes/clientRoutes');

app.use('/api/plans', planRoutes);
app.use('/api/clients', clientRoutes);

// Database connection
mongoose.connect('mongodb://localhost:27017/skap-architecture', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
