"use strict";

import { Bot } from "../bot.js";

export class ChageoBot extends Bot {
    url = "https://geocoding-api.open-meteo.com/v1/search?"

    constructor() {
        super("chageo.png", "ChageoBot", [{ cmd: "locate", desc: "Donne la latitude et la longitude d'une ville" }]);
    }

    runCustomCommand(command, args) {
        switch(command) {
            case "locate":
                return this.gps(args);
        }

        return "";
    }

    gps(args) {
        const data = this.api.get(`${this.url}name=${args}&count=1&language=fr&format=json`);

        return data.then(response => {
            if(response.data.results){
                if(response.data.results.length > 0){
                    return "Latitude : " + response.data.results[0].latitude + ", Longitude : " + response.data.results[0].longitude;
                }
            }

            return "La recherche n'a pas abouti";
        });
    }
}