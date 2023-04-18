"use strict";

import { Bot } from "../bot.js";

export class ChameteoBot extends Bot {
    constructor() {
        super("chameteo.png", "ChameteoBot", [{ cmd: "meteo", desc: "Affiche la météo d'une ville" }]);
    }

    runCustomCommand(command, args) {
        switch(command) {
            case "meteo":
                return this.meteo(args);
        }
        
        return "";
    }

    meteo(args) {
        return "Météo de " + args;
    }
}