import { AiService } from "@/services/ai/ai-service"
import resolve from "@jridgewell/resolve-uri"
import sharp from "sharp"
import { iteratorToStream } from "@/utils/stream"
import { ScrapeStep } from "@/types/scrape"
import { scrapeSchema } from "@/schemas/scrape"
import { checkSessionCookie } from "@/utils/session"
import { globalRateLimit } from "@/utils/rate-limit"
import { NextResponse } from "next/server"

const screenshotPage = async (url: string) => {
  const res = await fetch(
    `https://scraping.narf.ai/api/v1/?${new URLSearchParams({
      url,
      api_key: process.env["SCRAPING_API_KEY"]!,
      render_js: "true",
      screenshot: "true",
      total_timeout_ms: "60000",
    }).toString()}`
  )

  if (res.status !== 200) {
    console.error(await res.text())
    throw new Error()
  }
  const blob = await res.blob()
  const screenshotBuffer = await blob.arrayBuffer()

  return Buffer.from(screenshotBuffer)
}

interface PageInformation {
  pageIndex: number
  companyInformation: string
  competences: string[]
}

export const POST = globalRateLimit(async (req) => {
  const session = await checkSessionCookie()

  if (!session) {
    return NextResponse.error()
  }

  const body = scrapeSchema.safeParse(await req.json())

  if (!body.success) {
    return NextResponse.error()
  }

  const responseGenerator = scrapeGenerator(body.data)
  const stream = iteratorToStream(responseGenerator)

  return new NextResponse(stream)
})

async function* scrapeGenerator({
  url,
  language,
  availableRegionsEnglish,
}: typeof scrapeSchema._type): AsyncGenerator<ScrapeStep> {
  const guessGenerator = AiService.chatCompletion({
    messages: [
      {
        role: "user",
        text:
          language === "sv"
            ? `Vad låter det som att detta företag gör? Svara på ett kort och finurligt sätt: ${url}`
            : language === "fi"
            ? `Minkälaiselta tämä yritys kuulostaa? Vastaa lyhyesti, ytimekkäästi ja nokkelasti: ${url}`
            : `What does it sound like this business does? Answer in a short, concise and witty way: ${url}`,
      },
    ],
  })

  let guess = ""
  for await (const chunk of guessGenerator) {
    guess = chunk
  }

  yield { step: "guess", guess }

  const linksScrapeRes = await fetch(
    `https://scraping.narf.ai/api/v1/?${new URLSearchParams({
      url,
      api_key: process.env["SCRAPING_API_KEY"]!,
      render_js: "true",
      extract_rules: JSON.stringify({
        links: { type: "all", selector: "a", output: "@href" },
      }),
    }).toString()}`
  )

  const resolvedUrl = linksScrapeRes.headers.get("Resolved-Url")!

  if (linksScrapeRes.status !== 200) {
    console.error(await linksScrapeRes.text())
    throw new Error()
  }

  const scrape = await linksScrapeRes.json()

  const allLinks = Array.from(
    new Set([
      resolvedUrl,
      ...(scrape.links as string[])
        .sort((a, b) => a.length - b.length)
        .map((href) => resolve(href, resolvedUrl)),
    ])
  ).slice(0, 20)

  yield { step: "links", allLinks }

  let foundCompanyName: string | null = null
  let foundCompanyRegions: string[] | null = null
  const pageInformation: Array<PageInformation> = []

  const systemMessage =
    () => `You analyze links given by the user to determine what a company does, and specifically to find out what sort of competences and jobs they may need.

The user will provide you with a screenshot of a link for you to analyze, and you will respond with a JSON object of properties "companyInformation", "competences" and "browseNextIndex".
${
  foundCompanyName === null
    ? `
"companyName" property: String | null
The name of the company you are analyzing. If you have not found it yet, provide null.
`
    : ``
}
${
  foundCompanyRegions === null
    ? `
"companyRegions" property: Array<${availableRegionsEnglish
        .map((r) => `"${r}"`)
        .join(" | ")}> | null
The regions where the company is located. If you have not found it yet, provide null.
`
    : ``
}
"companyInformation" property: String
The relevant information about the company you just gathered from the page you just analyzed.

"competences" property: String[]
If you found any possible competences (jobs) that the company may need on the page, please list them here. Specific roles, be exact and generous.

"browseNextIndex": Number | null
Provide the index of which link to analyze next. You can quit at any time by providing null.

- Career pages are important. If you find a career page, you MUST analyze it.
- NEVER repeat yourself.
- News can also be important. For example, if they are doing something new they may need factory personnel, engineers, or whatever relevant.
- If it seems to be a manufacturing company, they will most likely need factory personnel over engineers / office staff.
- Try to be as specific as possible, and no need to be so fancy.
  - Instead of writing "warehouse worker", do "forklift driver", "picker", "packer", etc.
  - Instead of "machine operator", do "injection molding operator", "machine service technicican", etc.
  - Instead of "woodworker" do "cabinet maker", "furniture maker", etc.

RESPONSE LANGUAGE: ${{ sv: "SWEDISH", en: "ENGLISH", fi: "FINNISH" }[language]}

Here are the links and their indicies:

${allLinks
  .map(
    (link, index) =>
      `${index}: ${link}${
        pageInformation.some((p) => p.pageIndex === index)
          ? " [ALREADY VISITED]"
          : ""
      }`
  )
  .join("\n")}`

  let nextIndexToBrowse: number | null = 0

  do {
    yield { step: "browsing", linkIndex: nextIndexToBrowse }

    let screenshotBuffer
    try {
      screenshotBuffer = await screenshotPage(allLinks[nextIndexToBrowse])
    } catch (e) {
      const anotherPageIndex = allLinks.findIndex(
        (l) => !pageInformation.some((p) => allLinks[p.pageIndex] === l)
      )
      if (anotherPageIndex === -1) {
        break
      }
      pageInformation.push({
        companyInformation: "Failed to browse to the page.",
        competences: [],
        pageIndex: anotherPageIndex,
      })
      console.log("Failed to screenshot", allLinks[nextIndexToBrowse])
      continue
    }

    const previewResized = await sharp(screenshotBuffer)
      .resize({
        withoutEnlargement: true,
        position: "top",
        fit: "cover",
        height: 4000,
      })
      .toFormat("jpeg")
      .toBuffer()

    yield {
      step: "screenshot",
      linkIndex: nextIndexToBrowse,
      screenshotData: previewResized.toString("base64"),
    } as const

    const resized = await sharp(screenshotBuffer)
      .resize({
        withoutEnlargement: true,
        height: 10000,
      })
      .toBuffer()

    type GeneratorResponse = Pick<
      PageInformation,
      "competences" | "companyInformation"
    > & {
      browseNextIndex: number | null
      companyName?: string | null
      companyRegions?: string[] | null
    }
    const generator = AiService.jsonChatCompletion<GeneratorResponse>({
      systemMessage: systemMessage(),
      messages: [
        ...pageInformation.flatMap(
          ({ pageIndex, companyInformation, competences }, idx, arr) =>
            [
              {
                role: "user",
                text: allLinks[pageIndex],
              },
              {
                role: "assistant",
                text: JSON.stringify({
                  companyInformation,
                  competences,
                  browseNextIndex:
                    idx === arr.length - 1
                      ? nextIndexToBrowse
                      : arr[idx + 1].pageIndex,
                }),
              },
            ] as const
        ),
        {
          role: "user",
          text: allLinks[nextIndexToBrowse],
          image: resized,
        },
      ],
    })

    let generatorResponse: GeneratorResponse | null = null
    for await (const chunk of generator) {
      if (typeof chunk === "string") {
        try {
          const extractedInformation = JSON.parse(chunk + '"}')

          yield {
            step: "pageInformationChunk",
            chunk: extractedInformation.companyInformation,
          }
          continue
        } catch (e) {
          continue
        }
      }
      generatorResponse = chunk
    }

    if (!generatorResponse) {
      throw new Error()
    }

    if (foundCompanyName === null && generatorResponse.companyName) {
      foundCompanyName = generatorResponse.companyName

      yield {
        step: "companyName",
        companyName: foundCompanyName,
      }
    }

    if (foundCompanyRegions === null && generatorResponse.companyRegions) {
      foundCompanyRegions = generatorResponse.companyRegions

      yield {
        step: "companyRegions",
        regions: foundCompanyRegions,
      }
    }

    yield {
      step: "pageInformation",
      linkIndex: nextIndexToBrowse,
      information: generatorResponse.companyInformation,
      competences: generatorResponse.competences,
    }

    pageInformation.push({
      pageIndex: nextIndexToBrowse,
      companyInformation: generatorResponse.companyInformation,
      competences: generatorResponse.competences,
    })
    if (generatorResponse.browseNextIndex !== null) {
      nextIndexToBrowse = Number(generatorResponse.browseNextIndex) as number
      // allLinks.splice(Number(res.browseNextIndex), 1)
    } else {
      nextIndexToBrowse = null
    }
  } while (nextIndexToBrowse !== null && pageInformation.length < 5)

  const summaryGenerator = AiService.chatCompletion({
    messages: [
      {
        role: "user",
        text: `Please write a detailed summary about this company in a neutral way, with a focus on the company's activities, competences, and possible job opportunities.
          
${pageInformation.map((p) => p.companyInformation).join("\n\n")}
          
RESPONSE LANGUAGE: ${
          { sv: "SWEDISH", en: "ENGLISH", fi: "FINNISH" }[language]
        }`,
      },
    ],
  })

  for await (const chunk of summaryGenerator) {
    yield {
      step: "summaryChunk",
      chunk,
    }
  }

  yield { step: "done" }

  return
}
