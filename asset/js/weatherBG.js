// ce fichier va contenir toutes les images de fond

const WEATHER_BACKGROUNDS = {
    // Groupe 2xx: Orages
    "orage-jour": "./asset/img/orage-jour.jpg",
    "orage-nuit": "./asset/img/orage-nuit.jpg",

    // Groupe 3xx: Bruine
    "bruine-jour": "./asset/img/bruine-jour.jpg",
    "bruine-nuit": "./asset/img/bruine-nuit.jpg",

    // Groupe 5xx: Pluie
    "pluie-jour": "./asset/img/pluie-jour.jpg",
    "pluie-nuit": "./asset/img/pluie-nuit.jpg",

    // Groupe 6xx: Neige
    "neige-jour": "./asset/img/neige-jour.jpg",
    "neige-nuit": "./asset/img/neige-nuit.jpg",

    // Groupe 7xx: Atmosphère (brume, brouillard, etc.)
    "brume-jour": "./asset/img/brume-jour.jpg",
    "brume-nuit": "./asset/img/brume-nuit.jpg",

    // Code 800: Ciel dégagé
    "ensoleille": "./asset/img/ensolleilé.jpg",
    "nuit-claire": "./asset/img/nuit-claire.jpg",

    // Groupe 80x: Nuages
    "nuageux-jour": "./asset/img/nuageux-jour.jpg",
    "nuageux-nuit": "./asset/img/nuageux-nuit.jpg",

    // Image par défaut
    "default": "./asset/img/default.jpg",
};

// Fonction pour définir l'image de fond en fonction des conditions météo
function getWeatherBackground(conditionCode, heure) {
    const estJour = heure >= 6 && heure <= 18;
    let backgroundKey = "default";

    if (conditionCode >= 200 && conditionCode < 300) {
        backgroundKey = estJour ? "orage-jour" : "orage-nuit";
    } else if (conditionCode >= 300 && conditionCode < 400) {
        backgroundKey = estJour ? "bruine-jour" : "bruine-nuit";
    } else if (conditionCode >= 500 && conditionCode < 600) {
        backgroundKey = estJour ? "pluie-jour" : "pluie-nuit";
    } else if (conditionCode >= 600 && conditionCode < 700) {
        backgroundKey = estJour ? "neige-jour" : "neige-nuit";
    } else if (conditionCode >= 700 && conditionCode < 800) {
        backgroundKey = estJour ? "brume-jour" : "brume-nuit";
    } else if (conditionCode === 800) {
        backgroundKey = estJour ? "ensoleille" : "nuit-claire";
    } else if (conditionCode > 800 && conditionCode < 900) {
        backgroundKey = estJour ? "nuageux-jour" : "nuageux-nuit";
    }

    return WEATHER_BACKGROUNDS[backgroundKey] || WEATHER_BACKGROUNDS.default;
}
