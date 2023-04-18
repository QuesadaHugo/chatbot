"use strict";

import { Bot } from "../bot.js";

export class ChapostalBot extends Bot {
    constructor() {
        super("chapostal.png", "ChapostalBot", [{ cmd: "cp", desc: "Affiche la/les ville(s) liée(s) au code postal" }]);
    }

    runCustomCommand(command, args) {
        switch(command) {
            case "cp":
                return this.zipCode(args);
        }
        
        return "";
    }

    zipCode(args) {
        return "Recherche des villes associées au code postal: " + args;
    }
}