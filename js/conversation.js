"use strict";

import { Message } from "./models/message.js";

export class Conversation {
    //Liste des messages de la conversation
    messages = [];
    participants = [];
    picture = "";
    title = "";
    id = 0;
    me = "Hugo";
    mePicture = "me.jpg";
    isDisplayed = false;

    constructor(title, picture){
        this.id = Math.floor(Math.random() * 1000000);
        this.title = title;
        this.picture = picture;

        //TODO: récupération des conversations enregistrées dans le localStorage
        this.messages = [];
        this.loadMessages();
    }

    loadMessages() {
        //TODO : récupération des conversations enregistrées dans le localStorage
        this.addMessage("Hugo", "Bonjour");
    }

    addParticipant(participant){
        this.participants.push(participant);

        this.setConversationParticipantsDisplay();
    }

    setConversationParticipantsDisplay() {
        const participants = document.getElementById('participants');
        participants.innerHTML = `${this.me}, ${this.getParticipants()}`;
    }

    getParticipants(){
        return this.participants.map(participant => participant.name).join(', ');
    }

    addMessage(participant, message){
        this.messages.push(new Message(participant, message));

        this.refreshConversation();
    }

    getMessages(){
        return this.messages;
    }

    sendMessage(prompt) {
        this.addMessage(this.me, prompt);
        this.sendCommand(prompt);
    }

    sendCommand(prompt) {
        for (let bot of this.participants) {
            const response = bot.runCommand(prompt);
    
            if(response != ""){
                this.addMessage(bot.name, response);
            }
        }
    }

    getLastMessage(){
        if(this.messages.length == 0) return "Aucun message";
        return this.messages.sort((a, b) => a.date > b.date)[0].message;
    }

    getLastMessageDate(){
        if(this.messages.length == 0) return "";
        return this.messages.sort((a, b) => a.date > b.date)[0].getFormattedDateWithTime();
    }

    getFirstMessageDate(){
        if(this.messages.length == 0) return "";
        return this.messages.sort((a, b) => a.date < b.date)[0].getFormattedDate();
    }

    refreshConversation() {
        if(!this.isDisplayed) return;

        const conversation = document.getElementById('conversation');
        conversation.innerHTML = "";

        //Entete de la conversation
        conversation.innerHTML += 
        `<div class="flex justify-center mb-2">
            <div class="rounded py-2 px-4" style="background-color: #DDECF2">
                <p class="text-sm uppercase">
                    ${this.getFirstMessageDate()}
                </p>
            </div>
        </div>

        <div class="flex justify-center mb-4">
            <div class="rounded py-2 px-4" style="background-color: #FCF4CB">
                <p class="text-xs">
                    Les messages et les appels sont maintenant sécurisés avec un cryptage de bout en bout.
                    Touchez pour plus d'informations.
                </p>
            </div>
        </div>`;
    
        for (let message of this.messages) {
            conversation.innerHTML += 
            `<div class="flex ${message.participant == this.me ? "justify-end" : ""} mb-2">
                <div class="mr-4">
                    <img class="h-12 w-12 rounded-full" src="./assets/${this.getParticipantPicture(message.participant)}" />
                </div>
                <div class="rounded pl-1 pr-3" style="background-color: #F2F2F2">
                    <div class="rounded py-2 px-3">
                        <p class="text-sm text-teal font-medium">
                            ${message.participant}
                        </p>
                        <p class="text-sm mt-1">
                            ${message.message}
                        </p>
                        <p class="text-right text-xs text-grey-dark mt-1">
                            ${message.getFormattedTime()}
                        </p>
                    </div>
                </div>
            </div>`;
        }

        conversation.scrollIntoView({ block: "end" });
    }

    getParticipantPicture(participant){
        if(participant == this.me) return this.mePicture;

        const participantFound = this.participants.find(p => p.name == participant);
        if(participantFound) return participantFound.picture;
        return "";
    }
}