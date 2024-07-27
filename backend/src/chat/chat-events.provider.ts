import { Provider } from "@nestjs/common";
import { EventEmitter } from "events";

export const ChatEventProvider: Provider = {
    provide: "CHAT_EVENTS",
    useValue: new EventEmitter(),
};
