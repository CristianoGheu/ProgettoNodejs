const db = require('./db');

async function getUserByEmail(email) {
  const [rows] = await db.execute('SELECT * FROM utenti WHERE email = ?', [email]);
  return rows;
}

async function createUser(nome, email, password) {
  const [result] = await db.execute('INSERT INTO utenti (nome, email, password) VALUES (?, ?, ?)', [nome, email, password]);
  return result.insertId;
}

// Funzioni per gestire gli intervalli
async function createInterval(startDate, endDate, userId) {
  const [result] = await db.execute('INSERT INTO intervals (start_date, end_date, user_id) VALUES (?, ?, ?)', [startDate, endDate, userId]);
  return result.insertId;
}

async function getIntervalsByUserId(userId) {
  const [rows] = await db.execute('SELECT * FROM intervals WHERE user_id = ?', [userId]);
  return rows;
}

// Funzioni per gestire gli obiettivi
async function createGoal(goal, intervalId) {
  const [result] = await db.execute('INSERT INTO goals (goal, interval_id) VALUES (?, ?)', [goal, intervalId]);
  return result.insertId;
}

async function getGoalsByIntervalId(intervalId) {
  const [rows] = await db.execute('SELECT * FROM goals WHERE interval_id = ?', [intervalId]);
  return rows;
}

module.exports = {
  getUserByEmail,
  createUser,
  createInterval,
  getIntervalsByUserId,
  createGoal,
  getGoalsByIntervalId
};
