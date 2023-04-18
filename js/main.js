"use strict";

import { Conversation } from "./conversation.js";
import { ChameteoBot } from "./bots/chameteo.js";
import { ChapostalBot } from "./bots/chapostal.js";
import { ChagpsBot } from "./bots/chagps.js";

const conversations = [];
let mainConversationId = 0;

function loadConversations() {
    //TODO : récupération des conversations enregistrées dans le localStorage
    seedConversation();
}

function seedConversation(){
    const conversation = new Conversation("Le QG des bots", "qgbot.png");
    mainConversationId = conversation.id;

    conversation.addParticipant(new ChameteoBot());
    conversation.addParticipant(new ChagpsBot());
    conversation.addParticipant(new ChapostalBot());

    conversation.isDisplayed = true;

    conversations.push(conversation);
}

window.sendCommand=(prompt = "") => {
    const input = document.getElementById('message');
    if(prompt == "") prompt = input.value;

    const conversation = conversations.find(c => c.isDisplayed);
    conversation.sendMessage(prompt);

    input.value = "";
}

document.addEventListener('keydown', (event) => {
    // dummy element
    var input = document.getElementById('message');

    // check for focus
    var isFocused = (document.activeElement === input);

    if(isFocused && event.code == "Enter") sendCommand();
  }, false);

//#region Affichage

function refreshSidePanel() {
    const contacts = document.getElementById('contacts');
    contacts.innerHTML = "";

    for (let conversation of conversations) {
        contacts.innerHTML += 
        `<div class="${conversation.isDisplayed ? "bg-gray-100" : "bg-white"} px-3 flex items-center bg-grey-light cursor-pointer">
            <div>
                <img class="h-12 w-12 rounded-full" src="./assets/${conversation.picture}" />
            </div>
            <div class="ml-4 flex-1 border-b border-grey-lighter py-4">
                <div class="flex items-bottom justify-between">
                    <p class="text-grey-darkest">
                        ${conversation.title}
                    </p>
                    <p class="text-xs text-grey-darkest">
                        ${conversation.getLastMessageDate()}
                    </p>
                </div>
                <p class="text-grey-dark mt-1 text-sm">
                    ${conversation.getLastMessage()}
                </p>
            </div>
        </div>`;
    }
}

//#endregion

loadConversations();

//On rafraichit le panneau latéral (les contacts)
refreshSidePanel();

//Envoi de commandes de test
sendCommand("gps Paris Toulouse");
sendCommand("cp 09100");
sendCommand("ping");
sendCommand("meteo Pamiers");
sendCommand("help");

