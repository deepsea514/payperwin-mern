const axios = require("axios");
const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

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

function setMeta(title, callback) {
    axios.get(`${serverUrl}/meta/${encodeURIComponent(title)}`, { withCredentials: true })
        .then(({ data }) => {
            if (data) {
                const { title, description, keywords } = data;
                setTitle({ pageTitle: title });
                const meta = {
                    title: title,
                    description: description,
                    canonical: 'https://www.payperwin.co',
                    meta: {
                        charset: 'utf-8',
                        name: {
                            keywords: keywords
                        }
                    }
                };
                callback(meta);
            }
            setTitle({ pageTitle: title });
        })
        .catch(() => {
            console.log('error')
            setTitle({ pageTitle: title });
        })
}

module.exports = {
    setTitle,
    setMeta,
    flashNotification,
    titleProperties,
};
