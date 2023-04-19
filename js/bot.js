'use strict';

import { Api } from "./api.js";

/**
 * Abstract Class Bot.
 *
 * @class Bot
 */
export class Bot {
    chatGptSecretKey = "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";
    chatGptUrl = "https://api.openai.com/v1";

    name = "";
    picture = "";
    commandsList = [];
    api = null;
    openai = null;

    static sharedCommands() { return [{ cmd: "info", desc: "Affiche la description d'une commande" }, { cmd: "help", desc: "Affiche la liste des commandes" }, { cmd: "ping", desc: "Ping... Pong!" }, { cmd: "chat", desc: "Permet de poser une question à un bot (usage: chat NOM_DU_BOT TEXTE)" }, { cmd: "debug", desc: "Commande de test, ne pas utiliser SVP" }]; }

    constructor(picture, name, commandsList) {
        if (this.constructor == Bot) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        
        this.api = new Api();

        this.openai = axios.create({
            baseURL: this.chatGptUrl,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.chatGptSecretKey}`,
            },
        });

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
            case "chat":
                return this.chat(args);
            case "debug":
                return this.debug();
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

    //Chat avec un bot
    chat(args) {
        const splitArgs = args.split(" ");
        const botName = splitArgs[0];
        const text = splitArgs.slice(1).join(" ");

        if(botName.toLowerCase() == this.name.toLowerCase()) {
            try {
                const messages = [
                    { role: "user", content: text },
                ];

                return this.openai.post("/chat/completions", {
                    model: "gpt-3.5-turbo",
                    messages,
                }).then((response) => {
                    return response.data.choices[0].message.content;
                });
            } catch (error) {
                return "Erreur durant la création du chat" + error;
            }
        }

        return "";
    }

    //Petit rebelle
    debug() {
        return `<video controls autoplay>
            <source src="./assets/rick.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>`;
    }

    //#endregion
}