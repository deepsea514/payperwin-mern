import React from "react";
import { useLang } from "./Metronici18n";
import { IntlProvider } from "react-intl";
import "@formatjs/intl-relativetimeformat/polyfill";
import "@formatjs/intl-relativetimeformat/dist/locale-data/en";
import "@formatjs/intl-relativetimeformat/dist/locale-data/es";
import "@formatjs/intl-relativetimeformat/dist/locale-data/ko";
import "@formatjs/intl-relativetimeformat/dist/locale-data/vi";

import enMessages from "./messages/en";
import esMessages from "./messages/es";
import koMessages from "./messages/ko";
import viMessages from "./messages/vi";

const allMessages = {
    en: enMessages,
    es: esMessages,
    ko: koMessages,
    vi: viMessages,
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
