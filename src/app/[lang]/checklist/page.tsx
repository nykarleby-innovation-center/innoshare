import Image from "next/image"
import { L10N_SERVER } from "@/l10n/l10n-server"
import { Language } from "@/types/language"
import { MailIcon } from "lucide-react"
import { Metadata } from "next"
import { PageHeader } from "@/components/server/page-header"
import { L10N_COMMON } from "@/l10n/l10n-common"
import Link from "next/link"
import Markdown from "react-markdown"

interface Params {
  lang: Language
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  return {
    title: `InnoShare | ${L10N_COMMON.contactUs[params.lang]}`,
    description: L10N_SERVER.heroText1[params.lang],
  }
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "sv" }, { lang: "fi" }]
}

export default async function ChecklistPage(props: {
  params: Promise<Params>
}) {
  const { lang } = await props.params

  return (
    <main className="max-w-6xl ml-auto mr-auto flex flex-col pt-32">
      <div className="flex flex-row items-center">
        <div className="flex flex-col gap-8 w-full p-8 lg:py-32 lg:flex-row lg:items-start">
          <div className="flex flex-col items-start flex-grow">
            <PageHeader className="mb-12">
              Checklista för kompetensdelning
            </PageHeader>
            <div className="flex flex-col">
              <Markdown
                className="mb-12 max-w-3xl"
                components={{
                  h1: ({ node, ...props }) => (
                    <h2
                      className="text-xl lg:text-3xl font-bold mb-4"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h3
                      className="text-lg lg:text-2xl font-bold mb-2"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h4 className="lg:text-xl font-bold mb-2" {...props} />
                  ),
                  p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                  li: ({ node, ...props }) => (
                    <li className="mb-2 list-inside " {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="mb-4 list-decimal" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="mb-4 list-disc" {...props} />
                  ),
                }}
              >
                {CHECKLIST}
              </Markdown>
              <Link
                className="self-end"
                href="https://lextera.fi"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/lextera.png"
                  alt="Lextera logo"
                  className="object-left self-end"
                  width={150}
                  height={30}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const CHECKLIST = `# Kompetensdelning - utgångspunkt, förslag pà riktlinjer och checklista

## 1. Utgångspunkt

Den arbetsgivare som ingått arbetsavtal med arbetstagaren ansvarar för allt, dvs. pensionsavgifter, sociala kostnader, skatter mm. Har med arbetstagarens anställningstrygghet att göra.

## 2. Förslag på riktlinjer inom kompetensdelningsnätverket

### Förslag 2.1:

Riktlinjer kring hur kompetensdelningens innebörd, verkningar och ansvarsfördelning mm. presenteras för arbetstagare till arbetsgivare inom kompetensdelningsnätverket, med andra ord: arbetsgivarna berättar om de praktiska aspekterna av kompetensdelningsnätverket ât sina arbetstagare på samma sätt. Har med säkerställande av jämlik information att göra.

### Förslag 2.2

Riktlinjer kring när möjligheten till deltagande i kompetensdelningsnätverket presenteras. Ar det t.ex. i samband med förestående permittering, lågsäsong etc.?

### Förslag 2.3

Riktlinjer kring kostnader förknippade med verkställande av kompetensdelning.

Hur beräknas administrativa kostnader? Procentandel?

### Förslag 2.4

Riktlinjer kring verkställande av introduktion till arbetet hos den arbetsgivare som emottar arbetstagaren.

Följs särskilda standarder, t.ex. ISO-standarder? Riktlinjer beträffande översändande av introduktionsmaterial arbetsgivarna emellan i syfte att säkerställa en trygg överföring ur arbetstagarens perspektiv.

### Förslag 2.5

Riktlinjer kring säkerställande av tillräckligt organiserat arbetsskydd med tillhörande riskanalys mm. hos den arbetsgivare som emottar arbetstagaren.

Riktlinjer beträffande översändande av t.ex. arbetsskyddsrelaterade föreskrifter arbetsgivarna emellan i syfte att säkerställa en trygg överföring ur arbetstagarens perspektiv.

### Förslag 2.6

Riktlinjer kring säkerställande av sekretess till följd av utbyte av tämligen känslig information i enlighet med åtminstone punkterna 2.3-2.5 ovan.

Ingående av separata sekretessavtal arbetsgivarna emellan inom kompetensdelningsnätverket? Hur kommunicera sekretess till arbetstagare som är föremål för kompetensdelningsnätverket? Exemplifiera åt sådana arbetstagare vilka de sekretessbelagda aspekterna inom den egna arbetsgivaren.

### Förslag 2.7

Riktlinjer kring mötesfrekvens bland arbetsgivarna inom kompetensdelningsnätverket.

Dvs. hur ofta samlas arbetsgivarna i frága för att utbyta erfarenheter, diskutera, ompröva/omändra riktlinjerna ovan (förslag 2.1-2.6). Förslag på mötesfrekvens initialt: 1 gång/4 månader, dvs. 3 gånger i året.

## 3. Checklista

Med anledning av ovanstående förslag pà riktlinjer inom kompetensdelningsnätverket presenteras nedanstående checklista för den enskilda arbetsgivaren inom kompetensdelningsnätverket:

**a)** Forum för presentation av kompetensdelningsnätverket. Besvara frágorna "vad, hur, varför, när" när det kommer till nätverket i fråga. Med forum avses i vilket sammanhang som frágorna besvaras. Är det inom ramen för månadsmöte, veckomöte eller dylikt? Viktigt att säkerställa alla arbetstagares rätt till jämlik information. I samband med presentationen bör deltagarlista undertecknas och dateras av samtliga arbetstagare i syfte att säkerställa arbetsgivaren att i listan specificerad information givits.

**b)** Erhållande av introduktions- och arbetsskyddsrelaterat material (se framför allt förslag 2.4-2.5 ovan för mer information) mellan den sk. överlätande arbetsgivaren och den sk. mottagararbetsgivaren. Skriftliga överenskommelser mellan den överlätande arbetsgivaren och mottagararbetsgivaren kring längden av arrangemanget i fråga.

**c)** En arbetstagare som är villig att delta i kompetensdelningen bör informeras av sin egen arbetsgivare med utgångspunkt i det introduktions- och arbetsskyddsrelaterade material som den egna arbetsgivaren erhållit av mottagararbetsgivaren. Diskussion med arbetstagaren beträffande hur lång tid utbytet mellan den överlåtande arbetsgivaren och mottagararbetsgivaren bör även föras. Ytterligare bör arbetstagaren informeras om ansvarsfördelningen mellan den överlåtande arbetsgivaren och mottagararbetsgivaren samt bestämmelser kring sekretess. Med sistnämnda avses att åt arbetstagaren bör berättas vilka de sekretessbelagda aspekterna inom den egna arbetsgivaren är (dvs. den överlåtande arbetsgivaren).

- I samband med dylikt detaljerat informerande bör bekräftelse på emottagande av ovanstående specificerad information samt övrig relevant information undertecknas och dateras av ovan nämnda arbetstagare och deltagare från arbetsgivarens sida.

**d)** Mottagararbetsgivaren bör på samma sätt som i punkt 3 c) ovan tillsammans med arbetstagaren gå igenom introduktionen till arbetet, arbetsskyddsaspekter, eventuella sekretessbelagda aspekter och övriga praktikaliteter mm. Aven gällande denna genomgang bör bekräftelse på emottagande av ovanstående specificerad information samt övrig relevant information undertecknas och dateras av ovan nämnda arbetstagare och deltagare från arbetsgivarens sida.

## 4. Ansvarsfriskrivning

Ovanstående punkter har utformats med utgångspunkt i diskussioner inom ramen för kompetensdelningsnätverket vintern 2025 och gäller aktuella aspekter i samband med initierandet av själva nätverket. Vid fortgående av nätverket i fråga bör informationen ovan revideras.

Detta dokument är senast uppdaterat 21.3.2025.

Anne Lindgren-Slotte, jur.mag. och ekon.mag.
`
