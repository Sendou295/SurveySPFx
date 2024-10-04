import { MessageBar, MessageBarType } from "@fluentui/react";
import * as React from "react";

export const MessageBarComponent = ({ message }: { message: { text: string, type: MessageBarType } | null }) => {
    return message ? (
        <MessageBar messageBarType={message.type}>
            {message.text}
        </MessageBar>
    ) : null;
}; 
