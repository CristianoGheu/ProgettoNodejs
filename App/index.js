const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const { users, goals, intervals } = require('./utenti');
const { intervalsRoutes, goalsRoutes } = require('./intervals');

app.use('/users', require('./utenti').router);
app.use('/intervals', intervalsRoutes);
app.use('/intervals/goals', goalsRoutes);

const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = { app, server, users, goals, intervals };
