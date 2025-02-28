import Image from "next/image"
import { Button } from "@/components/ui/button"
import { L10N_SERVER } from "@/l10n/l10n-server"
import { Language } from "@/types/language"
import { Logo } from "@/components/server/logo"
import {
  ChevronsLeftRightIcon,
  ChevronsRightLeftIcon,
  Mail,
} from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/server/page-header"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import { UpsertInterestFormDialog } from "@/components/client/upsert-interest-form-dialog"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { UnsubscribeToast } from "@/components/client/unsubscribe-toast"
import { decodeUnverifiedSessionCookie } from "@/utils/session"

interface Params {
  lang: Language
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  return {
    title: `InnoShare | ${L10N_SERVER.heroSlogan[params.lang]}`,
    description: L10N_SERVER.heroText1[params.lang],
  }
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "sv" }, { lang: "fi" }]
}

export default async function Home(props: { params: Promise<Params> }) {
  const { lang } = await props.params

  const session = await decodeUnverifiedSessionCookie()

  return (
    <main className="max-w-6xl ml-auto mr-auto flex flex-col pt-32">
      <UnsubscribeToast />
      <div className="flex flex-row items-center">
        <div className="flex flex-col-reverse gap-8 w-full p-8 lg:py-32 lg:flex-row">
          <div className="flex flex-col items-start flex-grow">
            <PageHeader className="mb-2">
              {session?.firstName
                ? L10N_SERVER.heroHeaderNamed(session.firstName)[lang]
                : L10N_SERVER.heroHeader[lang]}
            </PageHeader>
            <h2 className="text-lg font-semibold mb-8">
              {L10N_SERVER.heroSlogan[lang]}
            </h2>
            <p className="mb-4 max-w-xl">{L10N_SERVER.heroText1[lang]}</p>
            <p className="mb-8 max-w-xl">{L10N_SERVER.heroText2[lang]}</p>
            <div className="flex gap-4 mb-12 flex-col w-full sm:flex-row">
              {session === null && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <Mail className="h-5 w-5 mr-4" />
                      {L10N_COMMON.imInterested[lang]}
                    </Button>
                  </DialogTrigger>
                  <UpsertInterestFormDialog lang={lang} />
                </Dialog>
              )}
              <Link
                href={
                  `/${lang}/balance/?` +
                  new URLSearchParams({ viewOnly: "supply" }).toString()
                }
                legacyBehavior
                passHref
                locale="false"
              >
                <Button variant="ghost" className=" justify-start">
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
                <Button variant="ghost" className=" justify-start">
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
      </div>
      <Separator className="mb-8 lg:mb-24" />
      <div className="mb-32 p-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">
          {L10N_SERVER.watchTheVideo[lang]}
        </h2>

        <div className=" aspect-video border-2 border-secondary shadow-xl overflow-hidden rounded-md">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/qnZuk_f-R4w?si=Gvn1yilNAlFnx7JC&cc_lang_pref=${lang}&cc_load_policy=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </main>
  )
}
