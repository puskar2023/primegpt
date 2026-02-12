const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

/* Routes */
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();

/* Using middlewares */
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "https://primegpt-ls30.onrender.com",
    credentials: true

}));

/* Using Routes */
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.use(express.static(path.join(__dirname, "..", "public")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = app;