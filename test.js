const { createUser, getUserByEmail, createInterval, getIntervalsByUserId, createGoal, getGoalsByIntervalId } = require('./queries');

async function test() {
  try {
    // Crea un nuovo utente
    const userId = await createUser('Mario Rossi', 'mario.rossi@example.com', 'password123');
    console.log('Utente creato con ID:', userId);

    // Recupera l'utente per email
    const user = await getUserByEmail('mario.rossi@example.com');
    console.log('Utente recuperato:', user);

    // Crea un nuovo intervallo
    const intervalId = await createInterval('2023-01-01', '2023-12-31', userId);
    console.log('Intervallo creato con ID:', intervalId);

    // Recupera gli intervalli per userId
    const intervals = await getIntervalsByUserId(userId);
    console.log('Intervalli recuperati:', intervals);

    // Crea un nuovo obiettivo
    const goalId = await createGoal('Complete project', intervalId);
    console.log('Obiettivo creato con ID:', goalId);

    // Recupera gli obiettivi per intervalId
    const goals = await getGoalsByIntervalId(intervalId);
    console.log('Obiettivi recuperati:', goals);
  } catch (error) {
    console.error('Errore durante il test:', error);
  }
}

test();
