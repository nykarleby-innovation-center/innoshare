"use client"

import Link from "next/link"
import { AppLogo } from "../server/app-logo"
import { Button } from "../ui/button"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { Language } from "@/types/language"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BuildingIcon,
  Languages,
  LogIn,
  LogOutIcon,
  MenuIcon,
  Plus,
  PlusIcon,
  User,
  UserIcon,
} from "lucide-react"
import { ModeToggle } from "./mode-toggle"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/utils/ui"

export function Menu({
  lang,
  unverifiedUserFirstName,
  unverifedOrganizations,
}: {
  lang: Language
  unverifiedUserFirstName: string | null
  unverifedOrganizations: Array<{ id: string; name: string }>
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const pageWithoutLanguage = pathname.split("/").slice(2).join("/")

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 py-2 px-4 md:py-4 bg-background/80 backdrop-blur-lg z-30">
        <div className="max-w-6xl ml-auto mr-auto flex flex-row justify-between">
          <NavigationMenu className={cn(mobileMenuOpen ? "hidden" : "")}>
            <NavigationMenuList>
              <Link href={`/${lang}`} locale="false">
                <AppLogo className="w-8 h-8 md:w-16 md:h-16" />
              </Link>
              <NavigationMenuItem className="hidden md:block">
                <Link href={`/${lang}`} legacyBehavior passHref locale="false">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {L10N_COMMON.menuHome[lang]}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href={`/${lang}/balance`}
                  legacyBehavior
                  passHref
                  locale="false"
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {L10N_COMMON.competenceBalance[lang]}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href={`/${lang}/new-balance`}
                  legacyBehavior
                  passHref
                  locale="false"
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Plus className="w-5 h-5" />
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu
            className={cn("hidden md:flex", mobileMenuOpen ? "block" : "")}
          >
            <NavigationMenuList>
              <NavigationMenuItem>
                {unverifiedUserFirstName ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <User className="h-5 w-5 mr-4" />
                        {unverifiedUserFirstName ?? "User"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link
                        href={`/${lang}/user-settings`}
                        legacyBehavior
                        passHref
                        locale="false"
                      >
                        <DropdownMenuItem className="cursor-pointer">
                          <UserIcon className="w-4 h-4 mr-2" />
                          {L10N_COMMON.myProfile[lang]}
                        </DropdownMenuItem>
                      </Link>
                      {unverifedOrganizations.map((org) => (
                        <Link
                          key={org.id}
                          href={`/${lang}/edit-organization/${org.id}`}
                          legacyBehavior
                          passHref
                          locale="false"
                        >
                          <DropdownMenuItem
                            key={org.id}
                            className="cursor-pointer"
                          >
                            <BuildingIcon className="w-4 h-4 mr-2" />
                            {org.name}
                          </DropdownMenuItem>
                        </Link>
                      ))}
                      <Link
                        href={`/${lang}/new-organization`}
                        legacyBehavior
                        passHref
                        locale="false"
                      >
                        <DropdownMenuItem className="cursor-pointer">
                          <PlusIcon className="w-4 h-4 mr-2" />
                          {L10N_COMMON.newOrganization[lang]}
                        </DropdownMenuItem>
                      </Link>

                      <a href={`/api/auth/logout`}>
                        <DropdownMenuItem className="cursor-pointer">
                          <LogOutIcon className="w-4 h-4 mr-2" />
                          {L10N_COMMON.logOut[lang]}
                        </DropdownMenuItem>
                      </a>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={`/api/auth/login`}
                    legacyBehavior
                    passHref
                    locale="false"
                  >
                    <Button variant="ghost">
                      <LogIn className="h-5 w-5 mr-4" />
                      {L10N_COMMON.logIn[lang]}
                    </Button>
                  </Link>
                )}
              </NavigationMenuItem>
              <NavigationMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Languages className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/sv/${pageWithoutLanguage}`}>
                      <DropdownMenuItem>Svenska</DropdownMenuItem>
                    </Link>
                    <Link href={`/fi/${pageWithoutLanguage}`}>
                      <DropdownMenuItem>Suomi</DropdownMenuItem>{" "}
                    </Link>
                    <Link href={`/en/${pageWithoutLanguage}`}>
                      <DropdownMenuItem>English</DropdownMenuItem>{" "}
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <ModeToggle />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((m) => !m)}
            className="flex md:hidden"
          >
            {mobileMenuOpen ? (
              <ArrowRightIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>
    </>
  )
}
