import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ["en", "ja"],

    // Used when no locale matches
    defaultLocale: "ja",

    // Used when the locale is not in the URL
    localePrefix: "as-needed",
});