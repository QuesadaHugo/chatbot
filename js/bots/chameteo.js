"use strict";

import { Bot } from "../bot.js";

export class ChameteoBot extends Bot {
    url = "https://api.open-meteo.com/v1/forecast?"

    constructor() {
        super("chameteo.png", "ChameteoBot", [{ cmd: "meteo", desc: "Affiche la météo d'une ville.</br>Arguments attendus (2): [latitude] [longitude]" }]);
    }

    runCustomCommand(command, args) {
        switch(command) {
            case "meteo":
                return this.meteo(args);
        }
        
        return "";
    }

    meteo(args) {
        if(args.split(" ").length != 2) return "Erreur: 2 argument attendu, exemple: meteo 43.12 1.61";

        const splitArgs = args.split(" ");

        const data = this.api.getSynch(`${this.url}latitude=${splitArgs[0]}&longitude=${splitArgs[1]}&hourly=temperature_2m`);

        return data.then(response => {
            let moy = response.data.hourly.temperature_2m.reduce((a, b) => a + b, 0) / response.data.hourly.temperature_2m.length;
            moy = Math.round(moy * 100) / 100;

            return "Temperature moyenne sur la journée : " +  moy + "°C";
        });
    }
}