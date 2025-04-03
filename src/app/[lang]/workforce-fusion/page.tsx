import Image from "next/image"
import { L10N_SERVER } from "@/l10n/l10n-server"
import { Language } from "@/types/language"
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPin,
} from "lucide-react"
import { Metadata } from "next"
import { PageHeader } from "@/components/server/page-header"
import { Card, CardHeader } from "@/components/ui/card"

interface Params {
  lang: Language
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  return {
    title: `InnoShare | Workforce Fusion`,
    description: L10N_SERVER.heroText1[params.lang],
  }
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "sv" }, { lang: "fi" }]
}

export default async function WorkforceFusionPage(props: {
  params: Promise<Params>
  searchParams: Promise<{ Namn: string }>
}) {
  return (
    <main className="max-w-6xl ml-auto mr-auto flex flex-col pt-32">
      <div className="flex flex-row items-center">
        <div className="flex flex-col gap-8 w-full p-8 lg:py-32 lg:flex-row lg:items-start">
          <div className="flex flex-col items-start flex-grow">
            <PageHeader className="mb-2">
              <span className="inline-flex flex-row -translate-y-[30%] text-teal-500 dark:text-teal-400">
                Workforce
                <ChevronRightIcon className="w-[1em] h-[1em]" />
              </span>
              <span className="inline-flex flex-row  translate-y-[30%] -translate-x-[15%] text-orange-500 dark:text-orange-400">
                <ChevronLeftIcon className="w-[1em] h-[1em]" />
                Fusion
              </span>
            </PageHeader>
            <h2 className="text-lg font-semibold mb-4">
              InnoShares nätverksevenemang i Jakobstad
            </h2>
            <div className="flex flex-row gap-8 items-stretch h-16 mb-4">
              <Image
                src="/images/centria-color.svg"
                width={100}
                height={50}
                unoptimized
                alt="Centria logo"
                className="dark:hidden"
              />
              <Image
                src="/images/centria-white.svg"
                width={100}
                height={50}
                unoptimized
                alt="Centria logo"
                className="hidden dark:block"
              />
              <div className="w-[1px] bg-primary opacity-20" />
              <Image
                src="/images/nic-color.svg"
                width={100}
                height={50}
                unoptimized
                alt="NIC logo"
                className="dark:hidden"
              />
              <Image
                src="/images/nic-white.svg"
                width={100}
                height={50}
                unoptimized
                alt="NIC logo"
                className="hidden dark:block"
              />
            </div>
            <p className="mb-4 max-w-xl">
              Under evenemanget har ni möjlighet att diskutera hur ni gemensamt
              kunde inkorporera kompetensdelningsverksamheten smidigt i era
              företag. Vi får ta del av lyckade exempel från två företag i
              regionen, de berättar varför de själva hyrt in och ut personal och
              vad som bidrog till att det lyckades. Ni kan även hitta nya
              samarbetspartners.
            </p>
            <p className="mb-4 max-w-xl">
              När ni anmäler er uppmanas ni meddela om ni är endast allmänt
              intresserade, om ni har ett arbetskraftsbehov eller ett
              arbetskraftsutbud. Detta så att vi på förhand kan matcha ihop
              företag som kan ha nytta av att diskutera med varandra.
            </p>
            <p className="mb-8 max-w-xl">Anmäl er senast den 2 april.</p>
            <div className="flex gap-4 mb-4">
              <MapPin /> After Eight, Jakobstad
            </div>
            <div className="flex gap-4 mb-8">
              <CalendarIcon /> 10 April, 14:00
            </div>
            <h3 className="text-2xl mb-4 uppercase font-black">
              Preliminärt program
            </h3>
            <div className="grid grid-cols grid-cols-[30%_70%]">
              <div>14.00</div>
              <div>Kaffe och kaka</div>
              <div>14.15</div>
              <div>Välkommen</div>
              <div>14.30</div>
              <div>Företagscase</div>
              <div>15.00</div>
              <div>Matchmakingdiskussioner (15min x 2st)</div>
              <div>15.30</div>
              <div>Paus och fria diskussioner</div>
              <div>15.45</div>
              <div>Matchmakingdiskussioner (15min x 2st)</div>
              <div>16.15</div>
              <div>Avslutningsord</div>
              <div>16.30</div>
              <div>Nachotallrik</div>
            </div>
          </div>
          <Card>
            <CardHeader>
              <h3 className="text-2xl mb-4 uppercase font-black">
                Anmälning stängd
              </h3>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  )
}
