"use client"

import { ScrapeStep } from "@/types/scrape"
import Image from "next/image"
import { useState } from "react"
import Markdown from "react-markdown"
import { Button } from "../ui/button"
import { PlusIcon, XIcon } from "lucide-react"
import { scrapeSchema } from "@/schemas/scrape"
import { Prisma } from "@/utils/prisma"
import { Language } from "@/types/language"
import { L10N_COMMON } from "@/l10n/l10n-common"

export const AiAnalyzer = ({
  website,
  lang,
  availableRegions,
  onClose,
  onDone,
}: {
  website: string | null
  lang: Language
  availableRegions: Array<Pick<Prisma.Region, "id" | "l10nName">>
  onClose: () => any
  onDone: (data: {
    website: string
    companyName: string | null
    description: string
    competences: string[]
    regionIds: string[]
  }) => any
}) => {
  const [url, setUrl] = useState(website ?? "https://")
  const [stage, setStage] = useState<
    "enterUrl" | "browsing" | "analyzing" | "summarizing" | "done"
  >("enterUrl")

  const [companyName, setCompanyName] = useState<string | null>(null)
  const [companyRegionIds, setCompanyRegionIds] = useState<string[]>([])
  const [screenshotData, setScreenshotData] = useState<string | null>(null)
  const [links, setLinks] = useState<string[]>([])
  const [descriptions, setDescriptions] = useState<string[]>([])
  const [competences, setCompetences] = useState<string[]>([])
  const [browsingLinkIndex, setBrowsingLinkIndex] = useState<number | null>(
    null
  )
  const [informationChunk, setInformationChunk] = useState("")
  const [companySummary, setCompanySummary] = useState("")

  const [guess, setGuess] = useState<string | null>(null)

  const scrape = () => {
    setStage("browsing")

    fetch("/api/scrape", {
      method: "POST",
      body: JSON.stringify({
        url: url,
        language: lang,
        availableRegionsEnglish: availableRegions.map(
          (r) => (r.l10nName as any).en
        ),
      } satisfies typeof scrapeSchema._type),
    })
      .then(async (res) => {
        const reader = res.body!.getReader()
        let text = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          let t = new TextDecoder().decode(value)
          text += t.toString()
          let indexOfEol = -1
          while ((indexOfEol = text.indexOf("[EOL]")) !== -1) {
            const json = text.substring(0, indexOfEol)
            const step: ScrapeStep = JSON.parse(json.toString())

            if (step.step === "guess") {
              setGuess(step.guess)
            }
            if (step.step === "companyName") {
              setCompanyName(step.companyName)
            }
            if (step.step === "companyRegions") {
              const ids = availableRegions
                .filter((re) => step.regions.includes((re.l10nName as any).en))
                .map((r) => r.id)
              setCompanyRegionIds(ids)
            }
            if (step.step === "links") {
              setLinks(step.allLinks)
            }
            if (step.step === "screenshot") {
              setStage("analyzing")
              setScreenshotData(step.screenshotData)
            }
            if (step.step === "browsing") {
              setStage("browsing")
              setBrowsingLinkIndex(step.linkIndex)
            }
            if (step.step === "pageInformation") {
              setDescriptions((d) => [...d, step.information])
              setCompetences((c) => [...new Set([...c, ...step.competences])])
              setInformationChunk("")
            }
            if (step.step === "pageInformationChunk") {
              setGuess(null)
              setInformationChunk(step.chunk)
            }
            if (step.step === "summaryChunk") {
              setStage("summarizing")
              setCompanySummary(step.chunk)
            }
            if (step.step === "done") {
              setStage("done")
            }

            text = text.substring(indexOfEol + 5)
          }
        }
      })
      .catch((e) => {
        setStage("enterUrl")
        setCompanyName(null)
        setCompanyRegionIds([])
        setLinks([])
        setDescriptions([])
        setCompetences([])
        setBrowsingLinkIndex(null)
      })
      .finally(() => {})
  }

  return (
    <>
      <div
        className="fixed left-0 top-0 w-screen h-screen backdrop-blur-lg z-50  bg-gradient-to-b from-black dark:from-black/70 to-black/90 dark:to-black/50"
        onClick={() => onClose()}
      />
      <div className="fixed left-24 top-24 bottom-24 right-24 z-50 bg-gradient-to-br from-orange-500 via-black to-teal-500 animate-ai-appear-2" />
      <div className="fixed left-24 top-24 bottom-24 right-24 z-50 bg-gradient-to-br from-orange-500 via-black to-teal-400 animate-ai-appear-1">
        <div className="absolute left-0.5 right-0.5 top-0.5 bottom-0.5 bg-black/100 font-pixel text-white p-8 text-lg">
          <Image
            src="/arbeit-light.svg"
            alt="Arbeit"
            width={200}
            height={100}
            className="mb-8 w-full h-16 -mt-20"
          />
          <div className="p-8 pt-16 absolute left-0 top-0 right-0 bottom-0 flex flex-col items-stretch">
            {stage === "enterUrl" ? (
              <div className="flex flex-col items-center justify-center flex-grow text-2xl text-center">
                <div className="text-5xl">
                  {L10N_COMMON.welcomeToArbeit[lang]}
                </div>
                <div className="mb-12">
                  {L10N_COMMON.arbeitDescription[lang]}
                </div>
                <div className="mb-4 text-green-400" key="headline">
                  {L10N_COMMON.whereAreYouOnTheWeb[lang]}
                </div>
                <div className="flex flex-row">
                  <span className="mr-2">{"> "}</span>
                  <input
                    autoFocus
                    className="border border-white bg-transparent w-96 px-2 mr-2 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        scrape()
                      }
                    }}
                    onChange={(e) => {
                      setUrl(e.target.value)
                    }}
                    value={url}
                  />
                  <button onClick={scrape}>{L10N_COMMON.analyze[lang]}</button>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-row text-xl leading-tight">
                <div
                  className={` border-gray-700 h-full relative duration-300 transition-all ${
                    descriptions.length === 0 && stage !== "analyzing"
                      ? `flex-[0]`
                      : `border-2 mr-4 ${
                          stage !== "summarizing" && stage !== "done"
                            ? `flex-[3]`
                            : `flex-[5]`
                        }`
                  }`}
                >
                  <div className=" absolute top-0 left-0 right-0 bottom-0 overflow-y-auto p-4">
                    <div
                      className={`flex flex-row items-center gap-4 mb-4 ${
                        companyName ? `` : `opacity-50`
                      }`}
                    >
                      <div className="text-4xl">{companyName ?? "Företag"}</div>
                      <div className="flex flex-row flex-wrap gap-2">
                        {companyRegionIds.map((id) => (
                          <div key={id} className={`border border-white px-3`}>
                            {
                              (
                                availableRegions.find((r) => r.id === id)
                                  ?.l10nName as any
                              )[lang]
                            }
                          </div>
                        ))}
                      </div>
                    </div>
                    {companySummary ? (
                      <Markdown
                        className="mb-12"
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1
                              className="text-2xl font-bold mb-4"
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              className="text-2xl font-bold mb-4"
                              {...props}
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              className="text-2xl font-bold mb-4"
                              {...props}
                            />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="mb-4" {...props} />
                          ),
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
                        {companySummary}
                      </Markdown>
                    ) : (
                      <>
                        {stage === "analyzing" && (
                          <div className="mb-4">{informationChunk}</div>
                        )}
                        <div className="flex flex-col-reverse gap-4">
                          {descriptions.map((d, i) => (
                            <div key={i}>{d}</div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div
                  className={`border-gray-700 relative duration-300 transition-all ${
                    competences.length > 0 ? `flex-[2] border-2` : ``
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto p-4">
                    <div className="text-3xl">
                      {L10N_COMMON.competences[lang]}
                    </div>
                    <div>
                      {competences.map((c, index) => (
                        <div key={index}>{c}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className={`border-gray-700 relative duration-300 ${
                    stage !== "summarizing" && stage !== "done"
                      ? `flex-[4] border-2 ml-4`
                      : `flex-grow-0 border-none`
                  }`}
                >
                  {screenshotData && (
                    <div className="absolute w-full h-full">
                      <Image
                        fill
                        alt="screenshot"
                        src={`data:image/jpeg;base64,${screenshotData}`}
                        className="object-cover object-top animate-object-position-scroll"
                      />
                      <div
                        className={`absolute left-0 right-0 bottom-0 flex flex-row items-center p-4 bg-black ${
                          stage === "browsing" ? `opacity-100` : `opacity-0`
                        }`}
                      >
                        <Image
                          alt="Browsing..."
                          src="/browsing.webp"
                          width={64}
                          height={64}
                          className=""
                          style={{ imageRendering: "pixelated" }}
                        />
                        <div className="flex-grow overflow-ellipsis">
                          {browsingLinkIndex !== null
                            ? links[browsingLinkIndex]
                            : null}
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    className={`absolute w-full h-full flex flex-col justify-center items-center bg-black  ${
                      stage === "browsing" ? `opacity-100` : `opacity-0`
                    } duration-500`}
                    style={{
                      transitionDelay: stage !== "browsing" ? "0s" : "3s",
                    }}
                    key="another"
                  >
                    {browsingLinkIndex !== null ? (
                      <>
                        <Image
                          alt="Browsing..."
                          src="/browsing.webp"
                          width={128}
                          height={128}
                          style={{ imageRendering: "pixelated" }}
                        />
                        <div className="mb-4 text-3xl">
                          {L10N_COMMON.surfingEllipsis[lang]}
                        </div>
                        {browsingLinkIndex !== null ? (
                          <div className="mb-4">{links[browsingLinkIndex]}</div>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <Image
                          alt="Analyzing..."
                          src="/analyzing.gif"
                          width={544}
                          height={120}
                          style={{ imageRendering: "pixelated" }}
                        />
                        <div className="mb-4 text-3xl">
                          {L10N_COMMON.fetchingEllipsis[lang]}
                        </div>
                      </>
                    )}
                    {guess !== null ? (
                      <div className="max-w-lg text-center">
                        {L10N_COMMON.letMeGuessBeforeWebsiteText[lang]} {guess}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
            {stage === "done" ? (
              <div className="flex flex-row gap-4 justify-end mt-4 text-2xl">
                <button
                  className="border-orange-400 border-2 hover:border-orange-300 hover:text-orange-300 text-orange-400 px-4"
                  onClick={() => onClose()}
                >
                  {L10N_COMMON.close[lang]}
                </button>
                <button
                  onClick={() => {
                    onDone({
                      website: url,
                      companyName: companyName,
                      competences: competences,
                      description: companySummary,
                      regionIds: companyRegionIds,
                    })
                  }}
                  className="flex items-center border-teal-400 border-2 shadow-teal-700 shadow-md text-teal-400 px-4 hover:text-teal-300 hover:border-teal-300 hover:shadow-teal-400"
                >
                  <PlusIcon className="mr-2" />
                  {L10N_COMMON.addAndEdit[lang]}
                </button>
              </div>
            ) : null}
          </div>
          <Button
            size="icon"
            className="absolute top-4 right-4"
            variant="ghost"
            onClick={() => onClose()}
          >
            <XIcon />
          </Button>
        </div>
      </div>
    </>
  )
}
