"use strict";

import { Conversation } from "./conversation.js";
import { ChameteoBot } from "./bots/chameteo.js";
import { ChapostalBot } from "./bots/chapostal.js";
import { ChageoBot } from "./bots/chageo.js";
import { ConversationSerialization } from "./models/conversation.serialization.js";

const conversations = [];
let mainConversationId = 0;

function loadConversations() {
    const items = { ...localStorage };

    const keys = Object.keys(items);

    for (let i = 0; i < keys.length; i++) {
        let conversation = ConversationSerialization.deserialize(items[keys[i]]);

        if(conversation.isDisplayed) mainConversationId = conversation.id;

        conversations.push(conversation);
    }

    if(keys.length == 0) seedConversation();
}

function seedConversation(){
    const conversation = new Conversation("Le QG des bots", "qgbot.png");
    mainConversationId = conversation.id;

    conversation.addParticipant(new ChameteoBot());
    conversation.addParticipant(new ChageoBot());
    conversation.addParticipant(new ChapostalBot());

    conversation.isDisplayed = true;

    conversations.push(conversation);

    sendCommand("help");
}

window.sendCommand = (prompt = "") => {
    if(conversations.length == 0) return;

    const input = document.getElementById('message');
    if(prompt == "") prompt = input.value;

    prompt = prompt.trim();

    if(!isNullOrWhitespace(prompt)){
        const conversation = conversations.find(c => c.isDisplayed);
        conversation.sendMessage(prompt);

        input.value = "";
    }
}

function isNullOrWhitespace(input) {
    return !input || input.replace(/\s/g, '').length < 1;
}

document.addEventListener('keydown', (event) => {
    // dummy element
    var input = document.getElementById('message');

    // check for focus
    var isFocused = (document.activeElement === input);

    if(isFocused && event.code == "Enter") sendCommand();
  }, false);

document.addEventListener("new-message", function(e) {
    refreshSidePanel();
});

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

