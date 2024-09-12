import Image from "next/image"
import { Button } from "@/components/ui/button"
import { L10N_SERVER } from "@/l10n/l10n-server"
import { Language } from "@/types/language"
import { Logo } from "@/components/server/logo"
import { ChevronsLeftRightIcon, ChevronsRightLeftIcon } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

interface Params {
  lang: Language
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  return {
    title: `InnoShare | ${L10N_SERVER.heroSlogan[params.lang]}`,
    description: L10N_SERVER.heroText1[params.lang],
  }
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "sv" }, { lang: "fi" }]
}

export default async function Home({ params: { lang } }: { params: Params }) {
  return (
    <main className="max-w-6xl ml-auto mr-auto flex min-h-[90vh] flex-row items-center pt-32">
      <div className="flex flex-col-reverse gap-8 w-full p-8 pb-64 lg:py-32 lg:flex-row">
        <div className="flex flex-col items-start flex-grow">
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            {L10N_SERVER.heroHeader[lang]}
          </h1>
          <h2 className="text-lg font-semibold mb-8">
            {L10N_SERVER.heroSlogan[lang]}
          </h2>
          <p className="mb-4 max-w-xl">{L10N_SERVER.heroText1[lang]}</p>
          <p className="mb-8 max-w-xl">{L10N_SERVER.heroText2[lang]}</p>
          <div className="flex gap-4 mb-12">
            <Link
              href={
                `/${lang}/balance/?` +
                new URLSearchParams({ viewOnly: "supply" }).toString()
              }
              legacyBehavior
              passHref
              locale="false"
            >
              <Button variant="outline">
                <ChevronsLeftRightIcon className="h-5 w-5 mr-4 text-teal-400" />
                {L10N_SERVER.browseSupply[lang]}
              </Button>
            </Link>
            <Link
              href={
                `/${lang}/balance/?` +
                new URLSearchParams({ viewOnly: "need" }).toString()
              }
              legacyBehavior
              passHref
              locale="false"
            >
              <Button variant="outline">
                <ChevronsRightLeftIcon className="h-5 w-5 mr-4 text-orange-400" />
                {L10N_SERVER.browseNeeds[lang]}
              </Button>
            </Link>
          </div>

          <div className="flex flex-row gap-8 items-stretch h-16">
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
        </div>
        <Logo className="w-72 h-72 duration-300 hover:scale-105 hover:rotate-2" />
      </div>
    </main>
  )
}
