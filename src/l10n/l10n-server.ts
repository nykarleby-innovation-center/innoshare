import "server-only";

import { LanguageStrings } from "./types";

export const L10N_SERVER = {
  heroHeader: {
    en: "Welcome to InnoShare!",
    sv: "Välkommen till InnoShare",
    fi: "",
  },
  heroSlogan: {
    en: "Unleashing Collaborative Innovation and Talent Exchange",
    sv: "Unleashing Collaborative Innovation and Talent Exchange",
    fi: "Unleashing Collaborative Innovation and Talent Exchange",
  },
  heroText1: {
    en: "",
    sv: "I projektet InnoShare ska man utreda möjligheterna med kompetensdelning, hur företag och organisationer kan dela kompetens med varandra.",
    fi: "",
  },
  heroText2: {
    en: "",
    sv: "Projektet kommer att testa det här genom att personer byter arbetsplats för en viss tid. Det kommer att ordnas nätverksträffar för företag och organisationer i Jakobstadsregionen där kompetensdelningstemat behandlas. Utöver detta kommer en ”kompetenspool” och en prototypplattform för att dela och hitta kompetens skapas.",
    fi: "",
  },
  joinProjectText: {
    en: [
      "InnoShare is a joint project by",
      "Centria",
      "and",
      "Nykarleby Innovation Center r.f.",
    ],
    sv: [
      "InnoShare är ett gemensamt projekt av",
      "Centria",
      "och",
      "Nykarleby Innovation Center r.f.",
    ],
    fi: [],
  },
  openSourceText: {
    en: [
      "This platform's code is open source, and is available on",
      "GitHub",
      ". Found a bug? Create an Issue, and we'll fix it! (Or fix it yourself with a Pull Request)",
    ],
    sv: [
      "Denna plattform är byggd med öppen källkod, och finns tillgänglig på",
      "GitHub",
      ". Hittade du en bugg? Skapa en Issue så fixar vi den! (Eller fixa den själv med en Pull Request)",
    ],
    fi: [],
  },
  cofinancedText: {
    en: "Co-financed by European Union rural funding through ELY-keskus.",
    sv: "Medfinansieras av Europeiska unionens landsbygdsfinansiering via NTM-centralen.",
    fi: "",
  },
} satisfies LanguageStrings;
