"use strict";

import { Conversation } from "../conversation.js";
import { Bot } from "../bot.js";

export class ConversationSerialization {
    messages;
    participants;
    title;
    id;
    picture;
    isDisplayed;

    constructor(conversation) {
        this.messages = conversation.messages;
        this.participants = conversation.participants;
        this.title = conversation.title;
        this.id = conversation.id;
        this.picture = conversation.picture;
        this.isDisplayed = conversation.isDisplayed;
    }

    static deserialize(conv) {
        const conversation = new Conversation(conv.title, conv.picture, conv.id);
        conversation.isDisplayed = conv.isDisplayed;

        conv.participants.forEach(participant => {
            console.log(participant);
            conversation.addParticipant(new Bot(participant.picture, participant.name, participant.commandsList));
        });

        conversation.loadMessages(conv.messages);

        return conversation;
    }
}