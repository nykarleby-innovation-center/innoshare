import "server-only"
import { L10nText, L10nTranslationStrings } from "@/types/l10n"

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
    fi: "InnoShare tutkii kompetenssin jakamisen mahdollisuuksia, miten yritykset ja organisaatiot voivat jakaa kompetenssista keskenään.",
  },
  heroText2: {
    en: "The project tests this by having people switch workplaces for a certain period of time. This open-source platform is a tool for managing these exchanges. Feel free to browse around, or even sign up if your company is interested in participating!",
    sv: "Projektet testar detta genom att låta människor byta arbetsplatser under en viss tidsperiod. Denna plattform med öppen källkod är ett verktyg för att hantera dessa utbyten. Du kan bläddra runt eller till och med registrera dig om ditt företag är intresserat av att delta!",
    fi: "Projekti testaa tätä vaihtamalla ihmisten työpaikkoja tietyn ajanjakson ajaksi. Tämä avoimen lähdekoodin alusta on työkalu näiden vaihtojen hallintaan. Voit selailla alustaa tai jopa rekisteröityä, jos yrityksesi on kiinnostunut osallistumaan!",
  },
  browseNeeds: {
    en: "Browse needs",
    sv: "Bläddra behov",
    fi: "Selaa tarpeita",
  },
  browseSupply: {
    en: "Browse supply",
    sv: "Bläddra utbud",
    fi: "Selaa tarjontaa",
  },
  watchTheVideo: {
    en: "Watch the video",
    sv: "Se videon",
    fi: "Katso video",
  },
  itsLive: {
    en: "It's live!",
    sv: "Den är live!",
    fi: "Se on livenä!",
  },
  nowPublicText: {
    en: "The competence need/supply is now public. Your company's and contact information is not publicly visible, but must be unlocked by those who want to see it.",
    sv: "Kompetensbehovet/utbudet är nu offentligt. Era företags- och kontaktuppgifter är inte offentligt synliga, utan måste låsas upp av de som vill se.",
    fi: "Kompetenssitarve/-tarjonta on nyt julkinen. Yrityksenne ja yhteystietonne eivät ole julkisesti näkyvissä, vaan ne täytyy avata niitä haluaville.",
  },
  noOneUnlockedText: {
    en: "No one has unlocked the contact information for this yet.",
    sv: "Ingen har ännu låst upp kontaktinformationen till denna.",
    fi: "Kukaan ei ole vielä avannut tämän yhteystietoja.",
  },
  peopleAreInterested: {
    en: "People are interested",
    sv: "Folk är intresserade",
    fi: "Ihmiset ovat kiinnostuneita",
  },
  unlockersText: {
    en: "Here are the people who have unlocked the contact information for this competence need/supply.",
    sv: "Här är de som har låst upp kontaktuppgifterna till detta kompetensbehov/utbud.",
    fi: "Tässä ovat ne, jotka ovat avanneet tämän kompetenssitarpeen/-tarjonnan yhteystiedot.",
  },
  contactInformationUnlockedText: {
    en: "The contact information for this company is now unlocked.",
    sv: "Kontaktuppgifterna till detta företag är nu upplåsta.",
    fi: "Tämän yrityksen yhteystiedot on nyt avattu.",
  },
  youUnlockedForText: {
    en: [
      "You unlocked the contact information at ",
      "for",
      ". Your contact information is now also visible to them.",
    ],
    sv: [
      "Du låste upp kontaktinformationen",
      "för",
      ". Era kontaktuppgifter är nu även synliga för dem.",
    ],
    fi: [
      "Avasit yhteystiedot",
      "puolesta",
      ". Yhteystietosi ovat nyt myös näkyvissä heille.",
    ],
  },
  canYouFillThisNeed: {
    en: "Can you fill this need?",
    sv: "Kan ni fylla detta behov?",
    fi: "Voitteko täyttää tämän tarpeen?",
  },
  areYouInNeedOfThis: {
    en: "Are you in need of this?",
    sv: "Har ni behov av detta?",
    fi: "Tarvitsetteko tätä?",
  },
  pleaseConfirmYourInformation: {
    en: "Please confirm your information",
    sv: "Vänligen bekräfta er information",
    fi: "Vahvistakaa tietonne",
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
  createCompetenceBalance: {
    en: "Create competence balance",
    sv: "Skapa kompetensbalans",
    fi: "Luo kompetenssitasapaino",
  },
  youNeedToCreateOrganizationText: {
    en: "You need to create an organization before you can create a competence balance.",
    sv: "Ni behöver skapa en organisation innan ni kan skapa en kompetensbalans.",
    fi: "Sinun täytyy luoda organisaatio ennen kuin voit luoda kompetenssitasapaino.",
  },
  yourCompetenceBalanceContactDetailsWereUnlocked: {
    en: "Your competence balance contact details were unlocked",
    sv: "Dina kompetensbalans kontaktuppgifter låstes upp",
    fi: "Kompetenssitasosi yhteystiedot on avattu",
  },
  unlockedEmailText: (
    competenceNameL10n: L10nText,
    contactDetails: string
  ) => ({
    en: `Hi!
    
The contact details on your "${competenceNameL10n.en}" competence balance were unlocked.
    
This is who unlocked it:
${contactDetails}

Best regards,
Innoshare`,
    sv: `Hej!
    
Kontaktuppgifterna på din "${competenceNameL10n.sv}" kompetensbalans låstes upp.

Upplåstes av:
${contactDetails}

Med vänliga hälsningar,
Innoshare`,
    fi: `Moi!
    
Yhteystietosi pätevyystasolla "${competenceNameL10n.fi}" on avattu.

Sen avasi:
${contactDetails}
    
Ystävällisin terveisin,
Innoshare`,
  }),
} satisfies L10nTranslationStrings
