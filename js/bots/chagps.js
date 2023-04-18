"use strict";

import { Bot } from "../bot.js";

export class ChagpsBot extends Bot {
    constructor() {
        super("chagps.png", "ChagpsBot", [{ cmd: "gps", desc: "Affiche la distance entre deux destinations" }]);
    }

    runCustomCommand(command, args) {
        switch(command) {
            case "gps":
                return this.gps(args);
        }

        return "";
    }

    gps(args) {
        //Vérification du nombre d'arguments attendus pour la commande
        if(args.split(" ").length != 2) return "Erreur: 2 arguments attendus, exemple: gps Paris Lyon";

        //récupération des arguments de la commande
        const travel = args.split(" ");

        return "Distance entre " + travel[0] + " et " + travel[1];
    }
}