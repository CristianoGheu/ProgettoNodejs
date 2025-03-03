const express = require('express');
const intervalsRouter = express.Router();
const goalsRouter = express.Router();

let users = require('./utenti').users;
let goals = require('./utenti').goals;
let intervals = require('./utenti').intervals;

// metodi per l'inserimento, modifica e cancellazione di un intervallo di obiettivi: data inizio e data fine, utente a cui appartiene

// Inserimento intervallo
intervalsRouter.post('/', (req, res) => {
    const { startDate, endDate, userId } = req.body;

    if (!startDate || !endDate || !userId) {
       return res.status(400).send('Missing required fields');
    }

    const user = users.find((user) => user.id === userId);

    if (!user) {
       return res.status(400).send('User not found');
    }

    const newInterval = { id: intervals.length + 1, startDate, endDate, userId, goals: [] };
    intervals.push(newInterval);
    res.status(201).json(newInterval);
});

// Modifica intervallo
intervalsRouter.put('/:id', (req, res) => {
    const intervalId = parseInt(req.params.id);
    const { startDate, endDate, userId } = req.body;
    const interval = intervals.find((interval) => interval.id === intervalId);

    if (!interval) {
       return res.status(400).send('Interval not found');
    }

    if (startDate) interval.startDate = startDate;
    if (endDate) interval.endDate = endDate;
    if (userId) {
        const user = users.find((user) => user.id === userId);
        if (!user) {
           return res.status(400).send('User not found');
        }
        interval.userId = userId;
    }
    return res.status(200).json(interval);
});

// Cancellazione intervallo
intervalsRouter.delete('/:id', (req, res) => {
    const intervalId = parseInt(req.params.id);
    const intervalIndex = intervals.findIndex((interval) => interval.id === intervalId);

    if (intervalIndex === -1) {
       return res.status(400).send('Interval not found');
    }

    intervals.splice(intervalIndex, 1);
    return res.status(204).end();
});

// Associazione di un obiettivo ad un intervallo
goalsRouter.post('/', (req, res) => {
    const { goal, intervalId } = req.body;

    if (!intervalId || !goal) {
       return res.status(400).send('Missing required fields');
    }

    const targetInterval = intervals.find((interval) => interval.id === intervalId);
    if (!targetInterval) {
       return res.status(400).send('Interval not found');
    }

    const newGoal = { id: goals.length + 1, goal, intervalId };
    goals.push(newGoal);
    
    if (!targetInterval.goals) {
        targetInterval.goals = [];
    }
    targetInterval.goals.push(newGoal);
    
    return res.status(201).json(newGoal);
});

//Ottieni tutti gli intervalli con filtraggio e impaginazione opzionali

intervalsRouter.get('/', (req, res) => {
    const { goal, startDate, endDate, page = 1, limit = 10 } = req.query;

    let filteredIntervals = intervals;

    if (goal) {
        filteredIntervals = filteredIntervals.filter((interval) =>
            interval.goals.some((g) => g.goal === goal)
        );
    }

    if (startDate && endDate) {
        filteredIntervals = filteredIntervals.filter((interval) =>
            interval.startDate >= startDate && interval.endDate <= endDate
        );
    }

    // Impaginazione
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedIntervals = filteredIntervals.slice(startIndex, endIndex);

    res.status(200).json(paginatedIntervals);
});

// Ottieni gli intervalli in base all'obiettivo
intervalsRouter.get('/by-goal/:goal', (req, res) => {
    const { goal } = req.params;
    const filteredIntervals = intervals.filter((interval) =>
        interval.goals && interval.goals.some((g) => g.goal === goal)
    );
    res.status(200).json(filteredIntervals);
});

// Ottieni gli intervalli in base alle date
intervalsRouter.get('/by-date', (req, res) => {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
        return res.status(400).send('Both startDate and endDate are required');
    }

    const filteredIntervals = intervals.filter((interval) =>
        interval.startDate >= startDate && interval.endDate <= endDate
    );
    
    res.status(200).json(filteredIntervals);
});

module.exports = { 
  intervalsRoutes: intervalsRouter, 
  goalsRoutes: goalsRouter, 
  users, 
  goals, 
  intervals 
};
