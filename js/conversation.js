"use strict";

import { Message } from "./models/message.js";
import { ConversationSerialization } from "./models/conversation.serialization.js";

const event = new CustomEvent("new-message", {});

export class Conversation {
    //Liste des messages de la conversation
    messages = [];
    participants = [];
    picture = "";
    title = "";
    id = 0;
    me = "Vous";
    mePicture = "me.jpg";
    isDisplayed = false;

    constructor(title, picture, id = 0) {
        if (id != 0) this.id = id;
        else this.id = Math.floor(Math.random() * 1000000);

        this.title = title;
        this.picture = picture;

        this.messages = [];
    }

    loadMessages(mes) {
        for (let i = 0; i < mes.length; i++) {
            this.messages.push(new Message(mes[i].participant, mes[i].message, new Date(mes[i].date)));
        }

        this.refreshConversation();
    }

    addParticipant(participant) {
        this.participants.push(participant);

        this.setConversationParticipantsDisplay();
    }

    setConversationParticipantsDisplay() {
        const participants = document.getElementById('participants');
        participants.innerHTML = `${this.me}, ${this.getParticipants}`;
    }

    get getParticipants() {
        return this.participants.map(participant => participant.name).join(', ');
    }

    addMessage(participant, message, date = null) {
        this.messages.push(new Message(participant, message, date));
        document.dispatchEvent(event);

        this.refreshConversation();
    }

    sendMessage(prompt) {
        this.addMessage(this.me, prompt);
        this.sendCommand(prompt);
    }

    sendCommand(prompt) {
        for (let bot of this.participants) {
            const response = bot.runCommand(prompt);

            if (typeof response == "object") {
                //Promise on attend la reponse avant d'envoyer le message
                response.then((res) => {
                    this.addMessage(bot.name, res);
                    document.dispatchEvent(event);
                });
            } else {
                if (response != "") {
                    this.addMessage(bot.name, response);
                    document.dispatchEvent(event);
                }
            }
        }
    }

    get lastMessage() {
        if (this.messages.length == 0) return "Aucun message";
        let message = this.messages[this.messages.length - 1].message;

        console.log(message);

        message = message.replaceAll("<br/>", " ");

        if (message.length > 50) return message.substring(0, 50) + "...";

        return message;
    }

    get lastMessageDate() {
        if (this.messages.length == 0) return "";
        return this.messages[this.messages.length - 1].getFormattedDate();
    }

    get firstMessageDate() {
        if (this.messages.length == 0) return "";
        return this.messages[0].getFormattedDate();
    }

    refreshConversation() {
        if (!this.isDisplayed) return;

        const conversation = document.getElementById('conversation');
        conversation.innerHTML = "";

        //Entete de la conversation
        conversation.innerHTML +=
            `<div class="flex justify-center mb-2">
            <div class="rounded py-2 px-4" style="background-color: #DDECF2">
                <p class="text-sm uppercase">
                    ${this.firstMessageDate}
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
                <div class="rounded pl-1 pr-3 message" style="background-color: #F2F2F2">
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

        setTimeout(function () {
            conversation.scrollIntoView({ block: "end" });
        }, 100);
    }

    getParticipantPicture(participant) {
        if (participant == this.me) return this.mePicture;

        const participantFound = this.participants.find(p => p.name == participant);
        if (participantFound) return participantFound.picture;
        return "";
    }
}