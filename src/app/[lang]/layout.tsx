import Image from "next/image"
import Link from "next/link"
import { Catamaran, VT323 } from "next/font/google"
import { cn } from "@/utils/ui"
import { Github, Instagram, Linkedin, Mail } from "lucide-react"
import { L10N_SERVER } from "@/l10n/l10n-server"
import { Language } from "@/types/language"
import { Logo } from "@/components/server/logo"
import { Menu } from "@/components/client/menu"
import { ThemeProvider } from "@/components/client/theme-provider"
import "../globals.css"
import type { Metadata } from "next"
import { decodeUnverifiedSessionCookie } from "@/utils/session"

const catamaran = Catamaran({ subsets: ["latin"], variable: "--font-sans" })
const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
})

export const metadata: Metadata = {
  title: "InnoShare",
  description: "",
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "sv" }, { lang: "fi" }]
}

export default async function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode
  params: { lang: Language }
}>) {
  const unverifiedSession = decodeUnverifiedSessionCookie()

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          catamaran.variable,
          vt323.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Menu
            lang={lang}
            unverifiedUserFirstName={unverifiedSession?.firstName ?? null}
            unverifedOrganizations={unverifiedSession?.organizations ?? []}
          />
          {children}
          <footer className="lg:ml-auto lg:mr-auto xl:max-w-6xl">
            <div className="bg-secondary/40 flex flex-col gap-16 lg:flex-row xl:-ml-[2rem] xl:w-[calc(100%+4rem)] xl:px-[2rem] xl:pt-[2rem] xl:pb-[4rem] xl:rounded-t-2xl">
              <div className="p-8 lg:w-3/5">
                <div className="flex flex-col md:flex-row gap-8">
                  <Logo secondary className="min-w-[8rem] h-32" />
                  <div className="flex flex-col gap-4">
                    <div>
                      {L10N_SERVER.joinProjectText[lang][0]}{" "}
                      <a className="underline" href="https://centria.fi">
                        {L10N_SERVER.joinProjectText[lang][1]}
                      </a>{" "}
                      {L10N_SERVER.joinProjectText[lang][2]}{" "}
                      <a
                        className="underline"
                        href="https://nykarlebyinnovationcenter.fi"
                      >
                        {L10N_SERVER.joinProjectText[lang][3]}
                      </a>
                    </div>
                    <div>
                      {L10N_SERVER.openSourceText[lang][0]}{" "}
                      <a
                        className="underline"
                        href="https://github.com/nykarleby-innovation-center/innoshare"
                      >
                        {L10N_SERVER.openSourceText[lang][1]}
                      </a>
                      {L10N_SERVER.openSourceText[lang][2]}
                    </div>
                    <div className="flex flex-row gap-4">
                      <div>
                        <Link href="mailto:info@innoshare.fi">
                          <Mail />
                        </Link>
                      </div>
                      <div>
                        <Link href="https://www.instagram.com/innoshare/">
                          <Instagram />
                        </Link>
                      </div>
                      <div>
                        <Link href="https://www.linkedin.com/company/101492502">
                          <Linkedin />
                        </Link>
                      </div>
                      <div>
                        <Link href="https://github.com/nykarleby-innovation-center/innoshare">
                          <Github />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm items-start p-8">
                {L10N_SERVER.cofinancedText[lang]}
                <div className="flex flex-row gap-4 w-full h-36">
                  <div className="relative flex-grow bg-white rounded-md overflow-hidden border-primary/15 border money">
                    <Image
                      src={
                        {
                          en: "/eu-en.svg",
                          sv: "/eu-sv.svg",
                          fi: "/eu-fi.svg",
                        }[lang]
                      }
                      layout="fill"
                      alt="EU-logo"
                      className="p-3"
                      unoptimized
                    />
                  </div>
                  <div className="relative flex-grow bg-white rounded-md overflow-hidden border-primary/15 border money">
                    <Image
                      src={
                        {
                          en: "/ely-en.svg",
                          sv: "/ely-sv.svg",
                          fi: "/ely-fi.svg",
                        }[lang]
                      }
                      layout="fill"
                      alt="ELY logo"
                      className="p-3"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
