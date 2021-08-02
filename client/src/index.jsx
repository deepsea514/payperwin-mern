import React from 'react';
import ReactDOM from 'react-dom';
import { setTitle } from './libs/documentTitleBuilder';
import Main from "./containers/main";

function handleVisibilityChange() {
    if (!document.hidden) {
        // clear notification count
        setTitle({ notificationCount: 0, flashNotification: false });
    }
}
document.addEventListener("visibilitychange", handleVisibilityChange, false);

ReactDOM.render(
    <Main />,
    document.querySelector('.root'),
);
