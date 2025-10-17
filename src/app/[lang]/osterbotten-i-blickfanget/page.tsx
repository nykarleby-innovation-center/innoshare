import Image from "next/image"
import { L10N_SERVER } from "@/l10n/l10n-server"
import { Language } from "@/types/language"
import { CalendarIcon, MapPin } from "lucide-react"
import { Metadata } from "next"
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

interface Params {
  lang: Language
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const params = await props.params
  return {
    title: `InnoShare | Österbotten i blickfånget`,
    description: L10N_SERVER.heroText1[params.lang],
  }
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "sv" }, { lang: "fi" }]
}

export default async function EventPage(props: {
  params: Promise<Params>
  searchParams: Promise<{ Namn: string }>
}) {
  const searchParams = await props.searchParams

  const session = await checkSessionCookie()
  const user =
    session &&
    (await prismaClient.user.findUnique({
      where: { id: session.userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        organizations: { select: { name: true } },
      },
    }))

  const submitForm = async (data: FormData) => {
    "use server"

    const email = data.get("Email") as string

    EmailService.sendEmail({
      messageType: "text",
      toType: "internal",
      subject: "Anmälan till Österbotten i blickfånget",
      to: ENVIRONMENT.INTERNAL_NOTIFICATION_TO,
      message: `
Anmälan till Österbotten i blickfånget

Namn: ${data.get("Namn")}
Företag: ${data.get("Företag")}
E-post: ${email}
Eventuella allergier: ${data.get("Allergier")}
Drink: ${data.get("Drink")}
Intresse: ${data.get("Intresse")}`,
    })

    EmailService.sendEmail({
      messageType: "text",
      toType: "user",
      subject: "Anmälan till Österbotten i blickfånget",
      to: email,
      message: `
Tack för er anmälan till Österbotten i blickfånget.

Välkommen!
Plats: Station 23, Jakobstad
Datum: 5 November 14:00

Namn: ${data.get("Namn")}
Företag: ${data.get("Företag")}
E-post: ${email}
Eventuella allergier: ${data.get("Allergier")}
Drink: ${data.get("Drink")}
Intresse: ${data.get("Intresse")}
        `,
    })

    redirect(`/sv/osterbotten-i-blickfanget?Namn=` + data.get("Namn"))
  }

  return (
    <main className="max-w-6xl ml-auto mr-auto flex flex-col pt-16">
      <div className="flex flex-col gap-8 w-full p-8 lg:py-32 lg:flex-row lg:items-start">
        <div className="flex flex-col items-start flex-grow">
          <div className="sticky top-32 overflow-hidden rounded-xl w-[90%] self-center shadow-purple-500/20 shadow-lg mb-8">
            <Image
              src="/images/event-banner.jpg"
              width={800}
              height={400}
              alt="Event banner"
              className="mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary dark:from-background to-transparent mix-blend-lighten hover:opacity-0 duration-300"></div>
          </div>
          <div className="bg-background/85 backdrop-blur-lg sticky top-32 w-full pt-8">
            <h2 className="text-lg font-semibold mb-2">
              Innoshares nästa stora evenemang
            </h2>
            <h1 className="text-4xl font-black uppercase mb-4">
              Österbotten i blickfånget
            </h1>
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
              InnoShare ordnar inspirationsevenemang! Vi fokuserar på
              Österbottens styrkor och hur man ser på Österbotten utifrån.
              Välkomna med och lyssna då Ronny Eriksson berättar om hur
              kreativitet och innovation kan användas som en motor för tillväxt.
              Mike Bradshaw, grundare av Sampo Accelerator, pratar om hur
              viktiga idéerna från landsbygden är ur ett storstadsperspektiv.
              Tomas Knuts lyfter upp framtidens flexibla ledarskap med glimten i
              ögat och vi från InnoShare tar upp erfarenheter gällande
              kompetensdelning.
            </p>
            <div className="flex gap-4 mb-4">
              <MapPin /> Station 23, Jakobstad
            </div>
            <div className="flex gap-4 mb-8">
              <CalendarIcon /> 5 November 14:00 - 17:00
            </div>
            <h3 className="text-2xl mb-4 uppercase font-black">Program</h3>
            <div className="grid grid-cols grid-cols-[10%_70%]">
              <div>14.00</div>
              <div>Mingel, dricka och tilltugg</div>
              <div>14.17</div>
              <div>Välkommen</div>
              <div>14.20</div>
              <div>
                Tomas Knuts: Framtidens flexibla ledarskap med glimten i ögat
              </div>
              <div>14.50</div>
              <div>
                Mike Bradshaw: Landsbygdsidéer ur ett storstadsperspektiv
              </div>
              <div>15.15</div>
              <div>Paus</div>
              <div>15.35</div>
              <div>
                Ronny Eriksson: Kreativitet och innovation som motor för
                tillväxt
              </div>
              <div>16.15</div>
              <div>InnoShare: Erfarenheter från projektet</div>
              <div>16.30</div>
              <div>Skavlansoffan</div>
              <div>17.00</div>
              <div>Tack å adjö!</div>
            </div>
            <p className="mb-4 max-w-xl">
              Talturerna är på svenska och engelska, evenemanget är trespråkigt.
            </p>
          </div>
        </div>
        <Card className="sticky top-32">
          <CardHeader>
            <h3 className="text-2xl mb-4 uppercase font-black">Anmäl er här</h3>
          </CardHeader>
          <CardContent>
            {searchParams.Namn ? (
              <p>
                Tack {searchParams.Namn}! Ni är anmäld. Kontrollera er inbox för
                bekräftelse.
              </p>
            ) : (
              <HtmlForm action={submitForm}>
                <div>
                  <Label>Namn</Label>
                  <Input
                    type="text"
                    required
                    name="Namn"
                    defaultValue={
                      user ? `${user.firstName} ${user.lastName}` : undefined
                    }
                  />
                </div>
                <div>
                  <Label>Företag</Label>
                  <Input
                    type="text"
                    required
                    name="Företag"
                    defaultValue={user?.organizations.at(0)?.name}
                  />
                </div>
                <div>
                  <Label>E-post</Label>
                  <Input
                    type="email"
                    name="Email"
                    required
                    defaultValue={user?.email}
                  />
                </div>
                <div>
                  <Label>Eventuella allergier</Label>
                  <Input name="Allergier" type="text" />
                </div>
                <div>
                  <Label>Gratis drink</Label>
                  <div className="mt-4">
                    <RadioGroup name="Drink" required>
                      <div className="flex gap-2">
                        <RadioGroupItem required value="Öl / Cider" /> Öl /
                        Cider
                      </div>
                      <div className="flex gap-2">
                        <RadioGroupItem required value="Mocktail" /> Mocktail
                      </div>
                      <div className="flex gap-2">
                        <RadioGroupItem required value="Ingen drink" /> Ingen
                        drink
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <div>
                  <Label>
                    Är ni behov av arbetskraft, eller har ni extra utbud, eller
                    bara annars intressererad?
                  </Label>
                  <div className="mt-4">
                    <RadioGroup name="Intresse" required>
                      <div className="flex gap-2">
                        <RadioGroupItem required value="Utbud" /> Utbud
                      </div>
                      <div className="flex gap-2">
                        <RadioGroupItem required value="Behov" /> Behov
                      </div>
                      <div className="flex gap-2">
                        <RadioGroupItem required value="Allmänt intresserad" />{" "}
                        Allmänt intresserad
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <Button>Skicka</Button>
              </HtmlForm>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
