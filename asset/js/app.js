// Attendre que la page soit chargée
document.addEventListener('DOMContentLoaded', function () {

    // Éléments du DOM
    const villeInput = document.getElementById('ville');
    const rechercherButton = document.getElementById('rechercher');
    const chargementDiv = document.getElementById('chargement');
    const erreurDiv = document.getElementById('erreur');
    const meteoDiv = document.getElementById('meteo');
    const nomVilleElement = document.getElementById('nomVille');
    const temperatureElement = document.getElementById('temperature');
    const descriptionElement = document.getElementById('description');
    const ressentiElement = document.getElementById('ressenti');
    const humiditeElement = document.getElementById('humidite');
    const ventElement = document.getElementById('vent');
    const iconElement = document.getElementById('icon');
    const footerElement = document.getElementById('footer');

    // Clé API (normalement, elle devrait être sécurisée côté serveur)
    // Utilisez votre propre clé en vous inscrivant sur OpenWeatherMap
    const API_KEY = "0b834bb19816bdd87bf2dca3499526fb"; // Remplacez par votre clé

    function definirArrierePlan(conditionCode, heure) {
        const backgroundImage = getWeatherBackground(conditionCode, heure);
        const cadre = document.body;

        if (cadre) {
            cadre.style.backgroundImage = 'backgroundImage'
                ? `linear-gradient(135deg, rgba(255,255,255,0.74), rgba(243,246,251,0.58)), url("${backgroundImage}")`
                : 'linear-gradient(135deg, rgba(255,255,255,0.78), rgba(243,246,251,0.7))';
            cadre.style.backgroundSize = 'cover';
            cadre.style.backgroundPosition = 'center';
            cadre.style.backgroundRepeat = 'no-repeat';
        }

        const meteoJour = determinerTypeMeteo(conditionCode);
        footerElement.textContent = `conditions actuelles : ${meteoJour}`;
    }

    function determinerTypeMeteo(conditionCode) {
        if (conditionCode >= 200 && conditionCode < 300) return "Orages";
        if (conditionCode >= 300 && conditionCode < 400) return "Bruine";
        if (conditionCode >= 500 && conditionCode < 600) return "Pluie";
        if (conditionCode >= 600 && conditionCode < 700) return "Neige";
        if (conditionCode >= 700 && conditionCode < 800) return "Conditions atmosphériques";
        if (conditionCode === 800) return "Ciel dégagé";
        if (conditionCode > 800 && conditionCode < 900) return "Nuageux";
        return "Conditions inconnues";
    }


    //Fonction afficher message d'erreur
    function afficherErreur(message) {
        erreurDiv.textContent = message;
        erreurDiv.style.display = 'block';
        meteoDiv.style.display = 'none';
        chargementDiv.style.display = 'none';
    }

    //Fonction pour récupérer et afficher la météo

    async function recupereMeteo(ville) {
        //Réinitialiser l'affichage
        erreurDiv.style.display = 'none';
        meteoDiv.style.display = 'none';
        chargementDiv.style.display = 'block';

        try {
            //Construire l'URL de l'API avec la ville et la clé
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${API_KEY}&units=metric&lang=fr`;

            console.log(`Récupération de la météo pour: ${ville}`);

            //Faire la requête API
            const response = await fetch(url);

            //vérifier si la requête a réussi
            if (!response.ok) {
                //Si le status est 404, la ville n'a pas été trouvée
                if (response.status === 404) {
                    throw new Error(`La ville "${ville}" n'a pas été trouvée.`);
                } else {
                    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                }
            }
            //Convertir la reponse en JSON
            const donnees = await response.json();
            console.log("Données météo reçues", donnees);

            //Mettre à jour l'interface avec les données reçues
            nomVilleElement.textContent = donnees.name;
            temperatureElement.textContent = `${Math.round(donnees.main.temp)}°C`;

            // Première lettre en majuscule pour la description
            const description = donnees.weather[0].description;
            descriptionElement.textContent = description.charAt(0).toUpperCase() + description.slice(1);


            ressentiElement.textContent = `${Math.round(donnees.main.feels_like)}°C`;
            humiditeElement.textContent = `${donnees.main.humidity}%`;
            ventElement.textContent = `${Math.round(donnees.wind.speed * 3.6)} km/h`; // Conversion de m/s en km/h

            //Ajouter l'icone météo
            const conditionCode = donnees.weather[0].id;
            const weatherIcon = getEmojiMeteo(conditionCode);
            iconElement.innerHTML = `<div class="icon-emoji">${weatherIcon}</div>`;


            // Définir l'arrière-plan en fonction de la météo
            const heureLocale = new Date().getHours();
            definirArrierePlan(donnees.weather[0].id, heureLocale);


            //afficher le bloc météo
            meteoDiv.style.display = 'block';
            chargementDiv.style.display = 'none';

        } catch (erreur) {
            console.error("Erreur lors de la récupération de la météo:", erreur);
            afficherErreur(erreur.message);
        }
    }

    //function pour changé les emojis en fonction de la météo
            function getEmojiMeteo(conditionCode) {
                if (conditionCode >= 200 && conditionCode < 300) return "⛈️"; // Orages
                if (conditionCode >= 300 && conditionCode < 400) return "🌦️"; // Bruine
                if (conditionCode >= 500 && conditionCode < 600) return "🌧️"; // Pluie
                if (conditionCode >= 600 && conditionCode < 700) return "❄️"; // Neige
                if (conditionCode >= 700 && conditionCode < 800) return "🌫️"; // Conditions atmosphériques
                if (conditionCode === 800) return "☀️"; // Ciel dégagé
                if (conditionCode > 800 && conditionCode < 900) return "☁️"; // Nuageux
                return "❓"; // Inconnu
            }

    //Fonction pour récupérer et afficher la météo

    async function recuperePrevision(ville) {

        try {
            //Construire l'URL de l'API avec la ville et la clé
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${API_KEY}&units=metric&lang=fr`;

            console.log(`Récupération de la météo pour: ${ville}`);

            //Faire la requête API
            const response = await fetch(url);

            //vérifier si la requête a réussi
            if (!response.ok) {
                // //Si le status est 404, la ville n'a pas été trouvée
                // if (response.status === 404) {
                //     throw new Error(`La ville "${ville}" n'a pas été trouvée.`);
                // } else {
                //     throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                // }
            }
            //Convertir la reponse en JSON
            const donneesPrevision = await response.json();
            console.log("Données météo reçues", donneesPrevision);
            console.log("Première entrée :", donneesPrevision.list[0]);

            const donneesPrevisionFiltrees = donneesPrevision.list.filter(prevision => {
                const datePrevision = new Date(prevision.dt_txt);
                const heurePrevision = datePrevision.getHours();
                return heurePrevision === 12; // Filtrer pour les prévisions à 12h
            });
            console.log("Prévisions filtrées pour 12h :", donneesPrevisionFiltrees);

            let forecastHTML = "";
            donneesPrevisionFiltrees.forEach(prevision => {
                const conditionCode = prevision.weather[0].id;
                const weatherIcon = getEmojiMeteo(conditionCode);
                const MainTemp = Math.round(prevision.main.temp);
                const timestamp = prevision.dt;
                const date = new Date(timestamp * 1000); // ×1000 car l'API donne des secondes, JS veut des millisecondes
                const nomJour = date.toLocaleDateString('fr-FR', { weekday: 'short' });
                forecastHTML += `
                    <div class="forecast-day">
                        <div class="forecast-day-name">${nomJour}</div>
                        <div class="forecast-icon">${weatherIcon}</div>
                        <div class="forecast-temp">${MainTemp}°C</div>
                    </div>
                `;
                
            });
            document.getElementById('forecastContainer').innerHTML = forecastHTML;


        } catch (erreur) {
            console.error("Erreur lors de la récupération de la météo:", erreur);
            afficherErreur(erreur.message);
        }
    }

    //Gérer le click sur le bouton de recherche
    rechercherButton.addEventListener('click', function () {
        const ville = villeInput.value.trim();

        if (ville === '') {
            afficherErreur('Veuillez entrer le nom d\'une ville.');
            return;
        }
        recupereMeteo(ville);
        recuperePrevision(ville);
    });

    // Gérer l'appui sur Entrée dans le champ de recherche
    villeInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            rechercherButton.click();
        }
    });

    // Charger la météo de Paris par défaut
    if (villeInput.value.trim() !== '') {
        recupereMeteo(villeInput.value.trim());
        recuperePrevision(villeInput.value.trim());
    }
});

