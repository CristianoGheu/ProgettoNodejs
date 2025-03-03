const express = require('express');
const router = express.Router();

let users = [];
let goals = [];
let intervals = [];

// metodi per l'inserimento, modifica e cancellazione di un utente: email, nome e cognome

// Inserimento utenti
router.post('/', (req, res) => {
    const { email, name, surname } = req.body;
    if (!email || !name || !surname) {
      return res.status(400).send('Missing required fields');
    }

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
        return res.status(400).send('User already exists');
    }

    const newUser = { id: users.length + 1, email, name, surname };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Modifica utenti
router.put('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { email, name, surname } = req.body;
    const user = users.find((user) => user.id === userId);

    if (!user) {
       return res.status(400).send('User not found');
    }

    if (email) user.email = email;
    if (name) user.name = name;
    if (surname) user.surname = surname;
    res.json(user);
});

// Cancellazione utenti
router.delete('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
       return res.status(400).send('User not found');
    }

    users.splice(userIndex, 1);
    res.status(204).send();
});

module.exports = { router, users, goals, intervals };