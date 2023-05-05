'use strict';

const eventClean = new CustomEvent("clean-chat", {});

/**
 * Abstract Class Bot.
 *
 * @class Bot
 */
export class Bot {
    //Solution la plus simple pour contourner le problème de clé qui a leak
    chatGptSecretKeyPart1 = "EPXUEDqKuTXHf8lCfmYWT3Bl";
    chatGptSecretKeyPart2 = "bkFJ41W674eet1NKHlf4ovLx";
    chatGptUrl = "https://api.openai.com/v1";

    name = "";
    picture = "";
    commandsList = [];
    openai = null;

    get sharedCommands() { 
        return [
            { cmd: "info", desc: "Affiche la description d'une commande. (usage: info COMMANDE)" }, 
            { cmd: "help", desc: "Affiche la liste des commandes. (usage: help)" }, 
            { cmd: "ping", desc: "Ping... Pong!. (usage: ping)" }, 
            { cmd: "chat", desc: "Permet de poser une question à un bot. (usage: chat NOM_DU_BOT TEXTE)" }, 
        ]; 
    }

    constructor(picture, name, commandsList) {
        this.openai = axios.create({
            baseURL: this.chatGptUrl,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer sk-${this.chatGptSecretKeyPart1}${this.chatGptSecretKeyPart2}`,
            },
        });

        this.picture = picture;
        this.name = name;
        this.commands = commandsList;
    }

    set commands(commandsList) {
        this.commandsList = this.sharedCommands;
        this.commandsList = this.commandsList.concat(commandsList);
    }

    runCommand(prompt) {
        //récupération du premier mot de la commande

        prompt = prompt.toLowerCase();

        const command = prompt.split(" ")[0];

        if(this.checkCommand(command)) {
            //récupération des arguments de la commande
            const args = prompt.split(" ").slice(1).join(" ");

            return this.executeCommand(command, args);
        }

        return "";
    }

    //Exécute une commande partagée par tous les bots
    executeCommand(command, args) {
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
            case "cp":
                return this.zipCode(args);
            case "locate":
                return this.gps(args);
            case "meteo":
                return this.meteo(args);
            case "doggo":
                return this.doggo();
            case "translate":
                return this.translate(args);
            case "clean":
                return this.clean();
            default:
                return "";
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
                    max_tokens: 100,
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

    //Du miel pour les oreilles
    debug() {
        return `<video controls autoplay>
            <source src="./assets/rick.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>`;
    }

    //#endregion

    //#region Commandes spécifiques

    
    //Retourne les villes liées à un code postal
    zipCode(args) {
        const data = axios.get(`https://apicarto.ign.fr/api/codes-postaux/communes/${args}`);

        return data.then(response => {
            if(response.data.length > 0){
                return "Ville(s) liée(s) au code postal :<br/>" + response.data.map(x => x.nomCommune).join(",<br/>");
            }

            return "La recherche n'a pas abouti";
        });
    }

    //Retourne la température moyenne d'une ville sur la journée
    meteo(args) {
        if(args.split(" ").length != 2) return "Erreur: 2 argument attendu, exemple: meteo 43.12 1.61";

        const splitArgs = args.split(" ");
        const data = axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${splitArgs[0]}&longitude=${splitArgs[1]}&hourly=temperature_2m`);

        return data.then(response => {
            let moy = response.data.hourly.temperature_2m.reduce((a, b) => a + b, 0) / response.data.hourly.temperature_2m.length;
            moy = Math.round(moy * 100) / 100;

            return "Temperature moyenne sur la journée : " +  moy + "°C";
        });
    }

    //Retourne les coordonnées GPS d'une ville
    gps(args) {
        const data = axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${args}&count=1&language=fr&format=json`);

        return data.then(response => {
            if(response.data.results){
                if(response.data.results.length > 0){
                    return "Latitude : " + response.data.results[0].latitude + ", Longitude : " + response.data.results[0].longitude;
                }
            }

            return "La recherche n'a pas abouti";
        });
    }

    //retourne une image de chien
    doggo() {
        const data = axios.get("https://api.thedogapi.com/v1/images/search");
        
        return data.then(response => {
            if(response.data){
                if(response.data.length > 0){
                    return `<img src="${response.data[0].url}" alt="doggo" />`;
                }
            }

            return "La recherche n'a pas abouti";
        });
    }

    //traduit une phrase en doggo
    translate(args) {
        const data = axios.get(`https://api.funtranslations.com/translate/doge.json?text=${args}`);
        
        return data.then(response => {
            if(response.data){
                return response.data.contents.translated;
            }

            return "La traduction n'a pas abouti";
        });
    }

    //nettoie le chat
    clean() {
        document.dispatchEvent(eventClean);
        return "Chat nettoyé";
    }

    //#endregion
}