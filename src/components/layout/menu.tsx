"use client"

import * as React from "react"
import Link from "next/link"
import { AppLogo } from "../app-logo"
import { Button } from "../ui/button"
import { cn } from "@/utils/ui"
import { Dialog, DialogTrigger } from "../ui/dialog"
import { InterestFormDialog } from "./interest-form-dialog"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { Language } from "@/l10n/types"
import { Languages, User } from "lucide-react"
import { ModeToggle } from "../mode-toggle"

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

export function Menu({ lang }: { lang: Language }) {
  return (
    <>
      <Dialog>
        <nav className="fixed top-0 left-0 right-0 py-2 px-4 md:py-4 bg-background/80 backdrop-blur-lg">
          <div className="max-w-6xl ml-auto mr-auto flex flex-row justify-between">
            <NavigationMenu>
              <NavigationMenuList>
                <AppLogo className="w-8 h-8 md:w-16 md:h-16" />
                <NavigationMenuItem className="hidden md:block">
                  <Link href={`/${lang}`} legacyBehavior passHref locale="false">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {L10N_COMMON.menuHome[lang]}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="hidden md:block">
                  <DialogTrigger asChild>
                    <Button variant="ghost">
                      {L10N_COMMON.menuNeeds[lang]}
                    </Button>
                  </DialogTrigger>
                </NavigationMenuItem>
                <NavigationMenuItem className="hidden md:block">
                  <DialogTrigger asChild>
                    <Button variant="ghost">
                      {L10N_COMMON.menuSupply[lang]}
                    </Button>
                  </DialogTrigger>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <DialogTrigger asChild>
                    <Button variant="ghost">
                      <User className="mr-2" />
                      {L10N_COMMON.logIn[lang]}
                    </Button>
                  </DialogTrigger>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Languages className="h-[1.2rem] w-[1.2rem]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href="/sv">
                        <DropdownMenuItem>Svenska</DropdownMenuItem>
                      </Link>
                      <Link href="/fi">
                        <DropdownMenuItem>Suomi</DropdownMenuItem>{" "}
                      </Link>
                      <Link href="/en">
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
          </div>
        </nav>
        <InterestFormDialog lang={lang} />
      </Dialog>
    </>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
