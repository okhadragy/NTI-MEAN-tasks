const express = require('express');
const connectDB = require('./config/db');
const courseRoutes = require('./routes/course.routes');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
connectDB();
app.use('/courses', courseRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
