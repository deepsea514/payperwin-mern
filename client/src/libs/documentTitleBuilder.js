let titleProperties = {
    notificationCount: 0,
    pageTitle: '',
    siteName: '',
    tagline: '',
    currentChannel: null,
    channelUserCount: null,
    flashNotification: false,
    delimiter: '-'
};

function setTitle(newProps) {
    if (newProps) {
        Object.assign(titleProperties, newProps);
    }
    let title = '';
    const {
        notificationCount,
        pageTitle,
        siteName,
        tagline,
        currentChannel,
        channelUserCount,
        delimiter,
    } = titleProperties;
    if (notificationCount) {
        title += `(${notificationCount}) `;
    }
    if (pageTitle) {
        title += pageTitle;
        if (siteName || tagline || currentChannel) {
            title += ` ${delimiter} `;
        }
    }
    if (!siteName) {
        if (currentChannel) {
            title += `${currentChannel}`;
        }
        if (channelUserCount) {
            title += ` [${channelUserCount} Users]`;
        }
    }
    if (siteName) {
        title += `${siteName}`;
    }
    if (tagline) {
        title += ` ${delimiter} ${tagline}`;
    }
    document.title = title;
}

function flashNotification(message) {
    titleProperties.flashNotification = true;
    const intervalTime = 1000;
    // Flash notification message for interval time then flash default title for interval time. repeat.
    document.title = message;
    setTimeout(setTitle, intervalTime)
    const interval = setInterval(() => {
        if (!titleProperties.flashNotification) {
            clearInterval(interval);
        } else {
            document.title = message;
            setTimeout(setTitle, intervalTime)
        }
    }, intervalTime * 2);
}


module.exports = {
    setTitle,
    flashNotification,
    titleProperties,
};
