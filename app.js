    const express = require('express'); // Importation de la bibliothèque Express.js
    const mongoose = require('mongoose'); // Importation de la bibliothèque Mongoose pour MongoDB
    const path = require('path'); // Importation du module path pour gérer les chemins de fichiers
    const livereload = require('livereload'); // Importation de la bibliothèque livereload pour l'auto-rafraîchissement
    const connectLivereload = require('connect-livereload'); // Importation du middleware connect-livereload

    const app = express(); // Création d'une application Express.js
    const port = process.env.PORT || 3000; // Définition du port pour le serveur

    app.use(express.urlencoded({ extended: true })); // Middleware pour analyser les corps URL-encodés
    app.set('view engine', 'ejs'); // Définition de EJS comme moteur de template
    app.use(express.static('public')); // Servir les fichiers statiques depuis le répertoire 'public'

    const { FemaleData, MaleData } = require('./models/DataOfDB'); // Importation des modèles Mongoose

    // Configuration de l'auto-rafraîchissement
    const liveReloadServer = livereload.createServer(); // Création d'un serveur livereload
    liveReloadServer.watch(path.join(__dirname, 'public')); // Surveillance du répertoire 'public' pour les changements

    app.use(connectLivereload()); // Utilisation du middleware connect-livereload

    liveReloadServer.server.once('connection', () => {
        setTimeout(() => {
            liveReloadServer.refresh('/'); // Rafraîchissement de la page lors de la connexion
        }, 100);
    });

    app.get('/', (req, res) => {
        res.sendFile('./views/signin.html', { root: __dirname }); // Servir le fichier signin.html sur la route racine
    });

    mongoose
        .connect('mongodb+srv://islam:foCqra7jHPaalMfq@cluster0.w1n39hw.mongodb.net/all-data?retryWrites=true&w=majority') // Connexion à MongoDB
        .then(() => {
            app.listen(port, () => console.log(`http://localhost:${port}/`)); // Démarrage du serveur
        })
        .catch((error) => {
            console.error('Erreur de connexion à MongoDB:', error); // Gestion des erreurs de connexion
        });

    app.post('/', async (req, res) => {
        try {
            const gender = req.body.gender; // Récupération du genre depuis le corps de la requête

            if (gender === 'male') {
                const pack_male = new MaleData(req.body); // Création d'un nouveau document MaleData
                await pack_male.save(); // Sauvegarde du document dans la base de données
                const result = await MaleData.find(); // Récupération de tous les documents MaleData
                console.log(result.at(-1).Username); // Affichage du nom d'utilisateur du dernier document
                res.render('after_signin.ejs', { arrobj: result, gender }); // Rendu de la vue after_signin.ejs
            } else {
                const pack_female = new FemaleData(req.body); // Création d'un nouveau document FemaleData
                await pack_female.save(); // Sauvegarde du document dans la base de données
                const result = await FemaleData.find(); // Récupération de tous les documents FemaleData
                console.log(result.at(-1).Username); // Affichage du nom d'utilisateur du dernier document
                res.render('after_signin.ejs', { arrobj: result, gender }); // Rendu de la vue after_signin.ejs
            }
        } catch (error) {
            console.error('Erreur:', error); // Gestion des erreurs
            res.send('<h1>Une erreur est survenue</h1>'); // Envoi d'un message d'erreur au client
        }
    });
