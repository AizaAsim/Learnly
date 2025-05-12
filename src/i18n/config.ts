import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { enTranslations } from "./en";

i18next.use(initReactI18next).init({
  lng: "en",
  debug: true,
  resources: {
    en: {
      translation: {
        ...enTranslations,
      },
    },
  },
});
