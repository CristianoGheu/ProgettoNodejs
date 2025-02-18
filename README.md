# ProgettoNodejs

Per questo progetto ho dovuto create delle API JSON RESTful con Node.js.

Le API JSON RESTful consentono:

- L’inserimento, la modifica e la cancellazione di un utente che ha le seguenti caratteristiche: l’email, il nome e il cognome.

- Consentono l’inserimento, la modifica e la cancellazione di un intervallo di obiettivi con le seguenti caratteristiche: la data di inizio e la data di fine dell’intervallo, l’utente a cui appartiene l’intervallo.

- Consentono l’associazione di un obiettivo ad un intervallo.

- Consentono di visualizzare tutti gli intervalli, di filtrare per obiettivi inclusi, e filtrare per data di inizio e fine.

Ho inserito dei test tramite Sinon, Mocha, Chai e Supertest:

- Mocha per il test del framework
- Sinon.js per spie di test, stub e mock
- Chai per le affermazioni
- Supertest per le affermazioni HTTP
