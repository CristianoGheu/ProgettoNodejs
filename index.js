let express = require('express');
let app = express();

app.use(express.json());

let port = process.env.PORT || 3000;

let users = [];
let goals = [];
let intervals = [];

// metodi per l'inserimento, modifica e cancellazione di un utente: email, nome e cognome

// Inserimento utenti

app.post('/users', (req, res) => {
    const { email, name, surname } = req.body;
    if (!email || !name || !surname) {
      return res.status(400).send('Missing required fields');
    }

    const existingUser = users.find((user) =>
    user.email === email);
    if (existingUser) {
        return res.status(400).send('User already exists');
    }

    const newUser = {id: users.length + 1, email, name, surname};
    users.push(newUser);
    res.status(201).json(newUser);
});

// Modifica utenti

app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { email, name, surname } = req.body;
    const user = users.find((user) =>
    user.id === userId);


    if (!user) {
       return res.status(400).send('User not found');
    }

    if (email) user.email = email;
    if (name) user.name = name;
    if (surname) user.surname = surname;
    res.json(user);
});

// Cancellazione utenti

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((user) =>
    user.id === userId);

    if (userIndex === -1) {
       return res.status(400).send('User not found');
    }

    users.splice(userIndex, 1);
    res.status(204).send();
});


// metodi per l'inserimento, modifica e cancellazione di un intervallo di obiettivi:
// data inizio e data fine, utente a cui appartiene

//Inserimento intervallo

app.post('/intervals', (req, res) => {
    const { startDate, endDate, userId } = req.body;

    if (!startDate, !endDate, !userId) {
       return res.status(400).send('Missing required fields');
    }

    const user = users.find((user) =>
    user.id === userId);

    if (!user) {
       return res.status(400).send('User not found');
    }

    const newInterval = {id: intervals.length + 1, startDate, endDate, userId, goals: []};
    intervals.push(newInterval);
    res.status(201).json(newInterval);
});

//Modifica intervallo

app.put('/intervals/:id', (req, res) => {
    const intervalId = parseInt(req.params.id);
    const { startDate, endDate, userId } = req.body;
    const interval = intervals.find((interval) =>
    interval.id === intervalId);

    if (!interval) {
       return res.status(400).send('Interval not found');
    }

    if (startDate) interval.startDate = startDate;
    if (endDate) interval.endDate = endDate;
    if (userId) {
        const user = users.find((user) =>
        user.id === userId);
        if (!user) {
           return res.status(400).send('User not found');
        }
        interval.userId = userId;
    }
    return res.status(200).json(interval);
})

//cancellazione intervallo

app.delete('/intervals/:id', (req, res) => {
    const intervalId = parseInt(req.params.id);
    const intervalIndex = intervals.findIndex((interval) =>
    interval.id === intervalId);

    if (intervalIndex === -1) {
       return res.status(400).send('Interval not found');
    }

    intervals.splice(intervalIndex, 1);
    return res.status(204).end();
})


// associazione di un obiettivo ad un intervallo

app.post('/goals', (req, res) => {
    const { goal, intervalId } = req.body;

    if (!intervalId || !goal) {
       return res.status(400).send('Missing required fields');
    }

    const targetInterval = intervals.find((interval) =>
    interval.id === intervalId);
    if (!targetInterval) {
       return res.status(400).send('Interval not found');
    }

    const newGoal = {id: goals.length + 1, goal, intervalId};
    goals.push(newGoal);
    
    if (!targetInterval.goals) {
        targetInterval.goals = [];
    }
    targetInterval.goals.push(newGoal);
    
    return res.status(201).json(newGoal);
});

// Visualizzare tutti gli intervalli,

app.get('/intervals', (req, res) => {
    return res.json(intervals);
})

// filtrare per obiettivi inclusi

app.get('/intervals/by-goal/:goal', (req, res) => {
    const { goal } = req.params;
    const filteredIntervals = intervals.filter((interval) =>
    interval.goals.some((g) =>
    g.goal === goal));

    res.json(filteredIntervals);
});

// filtrare per data di inizio e di fine

app.get('/intervals/by-date', (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate){
        return res.status(400).send('Missing required fields');
    }

    const filteredIntervals = intervals.filter((interval) =>
    interval.startDate >= startDate && interval.endDate <= endDate);

    res.json(filteredIntervals);
    }
);

const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

module.exports = { app, server, users, goals, intervals };
