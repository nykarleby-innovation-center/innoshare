import Image from "next/image"
import { L10N_SERVER } from "@/l10n/l10n-server"
import { Language } from "@/types/language"
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MailIcon,
  MapPin,
} from "lucide-react"
import { Metadata } from "next"
import { PageHeader } from "@/components/server/page-header"
import { checkSessionCookie } from "@/utils/session"
import { HtmlForm } from "@/components/server/html-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { prismaClient } from "@/utils/prisma"
import { EmailService } from "@/services/email/email-service"
import { ENVIRONMENT } from "@/utils/env"
import { redirect } from "next/navigation"
import { L10N_COMMON } from "@/l10n/l10n-common"
import Link from "next/link"

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

export default async function WorkforceFusionPage(props: {
  params: Promise<Params>
}) {
  const { lang } = await props.params

  return (
    <main className="max-w-6xl ml-auto mr-auto flex flex-col pt-32">
      <div className="flex flex-row items-center">
        <div className="flex flex-col gap-8 w-full p-8 lg:py-32 lg:flex-row lg:items-start">
          <div className="flex flex-col items-start flex-grow">
            <PageHeader className="mb-12">
              {L10N_COMMON.contactUs[lang]}
            </PageHeader>
            <div className="">
              <Image
                src="/images/centria-color.svg"
                width={150}
                height={100}
                unoptimized
                alt="Centria logo"
                className="dark:hidden mb-6"
              />
              <Image
                src="/images/centria-white.svg"
                width={150}
                height={100}
                unoptimized
                alt="Centria logo"
                className="hidden dark:block mb-6"
              />

              <h2 className="text-xl font-bold mb-2">Jimmy Nymark</h2>
              <div className="flex items-center gap-4 mb-8">
                <MailIcon className="w-5 h-5" />
                <Link href="mailto:jimmy.nymark@centria.fi">
                  jimmy.nymark@centria.fi
                </Link>
              </div>
              <h2 className="text-xl font-bold mb-2">Katja Jankens</h2>
              <div className="flex items-center gap-4 mb-8">
                <MailIcon className="w-5 h-5" />
                <Link href="mailto:katja.jankens@centria.fi">
                  katja.jankens@centria.fi
                </Link>
              </div>
              <h2 className="text-xl font-bold mb-2">Johnny Finne</h2>
              <div className="flex items-center gap-4 mb-8">
                <MailIcon className="w-5 h-5" />
                <Link href="mailto:johnny.finne@centria.fi">
                  johnny.finne@centria.fi
                </Link>
              </div>
              <h2 className="text-xl font-bold mb-2">Pia Forsman</h2>
              <div className="flex items-center gap-4 mb-12">
                <MailIcon className="w-5 h-5" />
                <Link href="mailto:pia.forsman@centria.fi">
                  pia.forsman@centria.fi
                </Link>
              </div>
              <Image
                src="/images/nic-color.svg"
                width={150}
                height={100}
                unoptimized
                alt="NIC logo"
                className="dark:hidden mb-6"
              />
              <Image
                src="/images/nic-white.svg"
                width={150}
                height={100}
                unoptimized
                alt="NIC logo"
                className="hidden dark:block mb-6"
              />
              <h2 className="text-xl font-bold mb-2">Frank Sandqvist</h2>
              <div className="flex items-center gap-4 mb-8">
                <MailIcon className="w-5 h-5" />
                <Link href="mailto:frank@nicenter.fi">frank@nicenter.fi</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
