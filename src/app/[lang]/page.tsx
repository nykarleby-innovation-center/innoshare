import { InterestFormDialog } from "@/components/layout/interest-form-dialog";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { L10N_COMMON } from "@/l10n/l10n-common";
import { L10N_SERVER } from "@/l10n/l10n-server";
import { Language } from "@/l10n/types";
import { Mail } from "lucide-react";
import Image from "next/image";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "sv" }, { lang: "fi" }];
}

export default function Home({
  params: { lang },
}: {
  params: { lang: Language };
}) {
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
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="lg"
                className="font-semibold mb-8"
              >
                <Mail className="mr-4" />
                {L10N_COMMON.imInterested[lang]}
              </Button>
            </DialogTrigger>
            <InterestFormDialog lang={lang} />
          </Dialog>

          <div className="flex flex-row gap-8 items-stretch h-16">
            <Image
              src="/centria-color.svg"
              width={100}
              height={50}
              alt="Centria logo"
              className="dark:hidden"
            />
            <Image
              src="/centria-white.svg"
              width={100}
              height={50}
              alt="Centria logo"
              className="hidden dark:block"
            />
            <div className="w-[1px] bg-primary opacity-20" />
            <Image
              src="/nic-color.svg"
              width={100}
              height={50}
              alt="NIC logo"
              className="dark:hidden"
            />
            <Image
              src="/nic-white.svg"
              width={100}
              height={50}
              alt="NIC logo"
              className="hidden dark:block"
            />
          </div>
        </div>
        <Logo className="w-72 h-72" />
      </div>
    </main>
  );
}
