# ProgettoNodejs

Per questo progetto ho dovuto create delle API JSON RESTful con Node.js.

Le API JSON RESTful consentono:

- L’inserimento, la modifica e la cancellazione di un utente che ha le seguenti caratteristiche: l’email, il nome e il cognome.

- Consentono l’inserimento, la modifica e la cancellazione di un intervallo di obiettivi con le seguenti caratteristiche: la data di inizio e la data di fine dell’intervallo, l’utente a cui appartiene l’intervallo.

- Consentono l’associazione di un obiettivo ad un intervallo.

- Consentono di visualizzare tutti gli intervalli, di filtrare per obiettivi inclusi, e filtrare per data di inizio e fine.

Ho scelto di dividere la parte per la gestione degli utenti e degli intervalli in due file.
Nel file index.js ho gestito il routing del progetto e inserito la costante server con la porta dove viene avviata l’applicazione.

MySQL
Come richiesto dal progetto ho implementato MySQL:

-Ho creato un file migration.js per ricostruire la struttura del database.

-Ho creato un file db.js per gestire la connessione al database.

-Ho creato un file queries.js per assicurarmi che tutte le query siano sicure contro attacchi di tipo SQL Injection utilizzando i prepared statement.

Per verificare le funzioni di query ho creato un file test.js.

Ho diviso i test in due file per una piu facile lettura e modifica futura.
Ho inserito dei test tramite Sinon, Mocha, Chai e Supertest:

- Mocha per il test del framework
- Sinon.js per spie di test, stub e mock
- Chai per le affermazioni
- Supertest per le affermazioni HTTP
