import { LanguageStrings } from "./types"
import "server-only"

export const L10N_SERVER = {
  heroHeader: {
    en: "Welcome to InnoShare!",
    sv: "Välkommen till InnoShare",
    fi: "Tervetuloa InnoShareen!",
  },
  heroSlogan: {
    en: "Unleashing Collaborative Innovation and Talent Exchange",
    sv: "Unleashing Collaborative Innovation and Talent Exchange",
    fi: "Unleashing Collaborative Innovation and Talent Exchange",
  },
  heroText1: {
    en: "InnoShare explores the possibilities of competence sharing, how companies and organizations can share competence with each other.",
    sv: "InnoShare utreder möjligheterna med kompetensdelning, hur företag och organisationer kan dela kompetens med varandra.",
    fi: "InnoShare tutkii osaamisen jakamisen mahdollisuuksia, miten yritykset ja organisaatiot voivat jakaa osaamista keskenään.",
  },
  heroText2: {
    en: "The project tests this by having people switch workplaces for a certain period of time. A platform for competence sharing will soon be launched on this page, so please register your interest to receive a notification when the platform is live!",
    sv: "Projektet testar detta genom att personer byter arbetsplats för en viss tid. På denna sida kommer snart en plattform för kompetensdelning att lanseras, så anmäl gärna ert intresse så får ni ett meddelande då plattformen är live!",
    fi: "Hanke testaa tätä antamalla ihmisille mahdollisuuden vaihtaa työpaikkaa tietyn ajanjakson. Tälle sivulle lanseerataan pian alusta osaamisen jakamiseen, joten ilmaise kiinnostuksesi niin saat ilmoituksen, kun alusta on käyttövalmis!",
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
    fi: [
      "InnoShare on yhteisprojekti, jonka takana ovat",
      "Centria",
      "ja",
      "Nykarleby Innovation Center r.f.",
    ],
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
    fi: [
      "Tämän alusta käyttää avointa lähdekoodia, ja se on saatavilla",
      "GitHubissa",
      ". Löysitkö bugin? Luo Issue, niin korjaamme sen! (Tai korjaa se itse Pull Requestin avulla)",
    ],
  },
  cofinancedText: {
    en: "Co-financed by European Union rural funding through ELY-keskus.",
    sv: "Medfinansieras av Europeiska unionens landsbygdsfinansiering via NTM-centralen.",
    fi: "Euroopan unionin maaseuturahaston rahoittama yhteistyössä ELY-keskuksen kanssa.",
  },
} satisfies LanguageStrings
