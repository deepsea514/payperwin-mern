import React from "react";
import { useLang } from "./Metronici18n";
import { IntlProvider } from "react-intl";
import "@formatjs/intl-relativetimeformat/polyfill";
import "@formatjs/intl-relativetimeformat/dist/locale-data/en";
import "@formatjs/intl-relativetimeformat/dist/locale-data/zh";
// import "@formatjs/intl-relativetimeformat/dist/locale-data/ko";

import enMessages from "./messages/en";
import zhMessages from "./messages/zh";

const allMessages = {
    en: enMessages,
    zh: zhMessages
};

export function I18nProvider({ children }) {
    const locale = useLang();
    const messages = allMessages[locale];

    return (
        <IntlProvider locale={locale} messages={messages}>
            {children}
        </IntlProvider>
    );
}
