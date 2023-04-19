"use strict";

import { Bot } from "../bot.js";

export class ChapostalBot extends Bot {
    url = "https://apicarto.ign.fr/api/codes-postaux/communes/";

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
        const data = this.api.get(`${this.url}${args}`);

        return data.then(response => {
            if(response.data.length > 0){
                return "Ville(s) liée(s) au code postal :<br/>" + response.data.map(x => x.nomCommune).join(",<br/>");
            }

            return "La recherche n'a pas abouti";
        });
    }
}