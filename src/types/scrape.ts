export type ScrapeStep =
  | { step: "guess"; guess: string }
  | {
      step: "links"
      allLinks: string[]
    }
  | {
      step: "browsing"
      linkIndex: number
    }
  | {
      step: "screenshot"
      linkIndex: number
      screenshotData: string
    }
  | { step: "companyName"; companyName: string }
  | { step: "companyRegions"; regions: string[] }
  | {
      step: "pageInformation"
      linkIndex: number
      information: string
      competences: string[]
    }
  | {
      step: "pageInformationChunk"
      chunk: string
    }
  | {
      step: "summaryChunk"
      chunk: string
    }
  | { step: "done" }
