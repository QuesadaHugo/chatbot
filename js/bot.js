'use strict';

/**
 * Abstract Class Bot.
 *
 * @class Bot
 */
export class Bot {
    name = "";
    picture = "";
    commandsList = [];
    static sharedCommands() { return [{ cmd: "info", desc: "Affiche la description d'une commande" }, { cmd: "help", desc: "Affiche la liste des commandes" }, { cmd: "ping", desc: "Ping... Pong!" }]; }

    constructor(picture, name, commandsList) {
        if (this.constructor == Bot) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        
        this.picture = picture;
        this.name = name;
        this.setCommandsList(commandsList);
    }

    setCommandsList(commandsList) {
        this.commandsList = Bot.sharedCommands();
        this.commandsList = this.commandsList.concat(commandsList);
    }

    //A redéfinir dans les classes enfants
    runCommand(prompt) {
        //récupération du premier mot de la commande
        const command = prompt.split(" ")[0];

        if(this.checkCommand(command)) {
            //récupération des arguments de la commande
            const args = prompt.split(" ").slice(1).join(" ");

            if(Bot.sharedCommands().map(c => c.cmd).includes(command)) {
                return this.runSharedCommand(command, args);
            }
            else 
            {
                return this.runCustomCommand(command, args);
            }
        }

        return "";
    }

    runCustomCommand(command, args) {
        throw new Error("Method 'runCustomCommand()' must be implemented.");
    }

    //Exécute une commande partagée par tous les bots
    runSharedCommand(command, args) {
        switch(command) {
            case "info":
                return this.info(args);
            case "help":
                return this.help();
            case "ping":
                return this.ping();
        }
    }

    //Vérifie si la commande est valide
    checkCommand(command) {
        return this.commandsList.map(c => c.cmd).includes(command);
    }

    //#region Commandes partagées

    //Ping Pong
    ping() {
        return "Pong !";
    }

    //Affiche la description d'une commande
    info(args) {
        if(this.checkCommand(args)){
            return this.commandsList.filter(c => c.cmd == args)[0]["desc"];
        }
        return "";
    }

    //Affiche la liste des commandes
    help() {
        return `Affichage de la liste des commandes :<br/>${this.commandsList.map(c => `  - ${c.cmd}: ${c.desc}`).join("<br/>")}`;
    }

    //#endregion
}