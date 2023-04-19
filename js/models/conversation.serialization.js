"use strict";

import { Conversation } from "../conversation.js";
import { ChameteoBot } from "../bots/chameteo.js";
import { ChapostalBot } from "../bots/chapostal.js";
import { ChageoBot } from "../bots/chageo.js";

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

    static deserialize(data) {
        let conv = JSON.parse(data);

        const conversation = new Conversation(conv.title, conv.picture, conv.id);
        conversation.isDisplayed = conv.isDisplayed;

        conv.participants.forEach(participant => {
            switch (participant.name) {
                case "ChameteoBot":
                    conversation.addParticipant(new ChameteoBot());
                    break;
                case "ChapostalBot":
                    conversation.addParticipant(new ChapostalBot());
                    break;
                case "ChageoBot":
                    conversation.addParticipant(new ChageoBot());
                    break;
            }
        });

        conversation.loadMessages(conv.messages);

        return conversation;
    }
}