"use client"

import {
  ArrowRightIcon,
  Calendar,
  ChevronsLeftRight,
  ChevronsRightLeft,
  MapPin,
  Plus,
  PlusIcon,
  SmileIcon,
  Star,
  UserRound,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "../ui/badge"
import { useState } from "react"
import { Toggle } from "../ui/toggle"
import { ToggleGroup } from "../ui/toggle-group"

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "../ui/select"
import { Input } from "../ui/input"
import Link from "next/link"
import { Language } from "@/types/language"
import { Prisma } from "@/utils/prisma"
import { L10nText } from "@/types/l10n"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { cn } from "@/utils/ui"
import { Button } from "../ui/button"

type SortType =
  | "newestFirst"
  | "oldestFirst"
  | "supplyFirst"
  | "needsFirst"
  | "byRegion"

export const BalanceListing = ({
  defaultShowNeeds,
  defaultShowSupply,
  lang,
  balances,
}: {
  defaultShowNeeds: boolean | null
  defaultShowSupply: boolean | null
  lang: Language
  balances: Array<
    Pick<
      Prisma.Balance,
      "id" | "createdAt" | "amount" | "startDate" | "endDate"
    > & {
      competence: Pick<Prisma.Competence, "l10nName" | "iconUrl">
      region: Pick<Prisma.Region, "l10nName">
      own: boolean
    }
  >
}) => {
  const [sortBy, setSortBy] = useState<SortType>("newestFirst")
  const [onlyShowOwn, setOnlyShowOwn] = useState(false)
  const [showNeeds, setShowNeeds] = useState(defaultShowNeeds ?? true)
  const [showSupply, setShowSupply] = useState(defaultShowSupply ?? true)
  const [search, setSearch] = useState("")

  return (
    <>
      <Link href={`/${lang}/new-balance`}>
        <Button className="absolute top-0 right-0">
          <PlusIcon className="mr-2 w-4 h-4" /> {L10N_COMMON.create[lang]}
        </Button>
      </Link>
      <div className="flex flex-col items-start w-full">
        <div className="flex flex-col items-stretch gap-4 w-full mb-8 lg:flex-row">
          <ToggleGroup
            className="items-stretch flex flex-col lg:flex-row"
            type="single"
          >
            <Toggle
              pressed={showNeeds}
              onPressedChange={() => setShowNeeds(!showNeeds)}
            >
              <ChevronsRightLeft className="mr-2 h-4 w-4 text-orange-700 dark:text-orange-400" />
              {L10N_COMMON.showNeeds[lang]}
            </Toggle>
            <Toggle
              pressed={showSupply}
              onPressedChange={() => setShowSupply(!showSupply)}
            >
              <ChevronsLeftRight className="mr-2 h-4 w-4 text-teal-700 dark:text-teal-400" />
              {L10N_COMMON.showSupply[lang]}
            </Toggle>
            {balances.some((b) => b.own) && (
              <Toggle
                pressed={onlyShowOwn}
                onPressedChange={() => setOnlyShowOwn(!onlyShowOwn)}
              >
                <SmileIcon className="mr-2 h-4 w-4" />
                {L10N_COMMON.onlyShowOwn[lang]}
              </Toggle>
            )}
          </ToggleGroup>
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortType)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sortera enligt" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{L10N_COMMON.sortBy[lang]}</SelectLabel>
                <SelectItem value="newestFirst">
                  {L10N_COMMON.newestFirst[lang]}
                </SelectItem>
                <SelectItem value="oldestFirst">
                  {L10N_COMMON.oldestFirst[lang]}
                </SelectItem>
                <SelectItem value="supplyFirst">
                  {L10N_COMMON.supplyFirst[lang]}
                </SelectItem>
                <SelectItem value="needsFirst">
                  {L10N_COMMON.needsFirst[lang]}
                </SelectItem>
                <SelectItem value="byRegion">
                  {L10N_COMMON.byRegion[lang]}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="hidden flex-grow lg:flex " />
          <Input
            className="w-48"
            placeholder={L10N_COMMON.searchEllipsis[lang]}
            value={search}
            onChange={(v) => setSearch(v.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 w-full gap-6 lg:grid-cols-3">
          {balances
            .sort((a, b) =>
              sortBy === "newestFirst"
                ? +b.createdAt - +a.createdAt
                : sortBy === "oldestFirst"
                ? +a.createdAt - +b.createdAt
                : sortBy === "supplyFirst"
                ? b.amount - a.amount
                : sortBy === "needsFirst"
                ? a.amount - b.amount
                : sortBy === "byRegion"
                ? (a.region.l10nName as L10nText)[lang].localeCompare(
                    (b.region.l10nName as L10nText)[lang]
                  )
                : 0
            )
            .filter(
              (nd) =>
                (!onlyShowOwn || nd.own) &&
                ((showNeeds && nd.amount < 0) ||
                  (showSupply && nd.amount > 0)) &&
                ((nd.competence.l10nName as L10nText)[lang]
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                  (nd.region.l10nName as L10nText)[lang]
                    .toLowerCase()
                    .includes(search.toLowerCase()))
            )
            .map((nd) => (
              <Link
                className="flex"
                href={`/${lang}/balance/${nd.id}`}
                key={nd.id}
              >
                <div
                  className={cn(
                    "relative w-full rounded-lg overflow-hidden bg-gradient-to-b from-secondary/20 to-secondary/40 p-4 group flex flex-row gap-8 duration-200 border border-l-8 hover:from-secondary/40 hover:to-secondary hover:cursor-pointer",
                    nd.createdAt >
                      new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
                      ? nd.amount < 0
                        ? `border-orange-500 shadow-md shadow-orange-500/20`
                        : `border-teal-500 shadow-md shadow-teal-500/20`
                      : `border-transparent`,
                    nd.amount < 0 ? `border-l-orange-500` : `border-l-teal-500`
                  )}
                >
                  <div className="flex flex-grow flex-col justify-between gap-2 mr-24">
                    <span className="uppercase leading-snug font-black text-xl flex flex-row gap-2">
                      {(nd.competence.l10nName as L10nText)[lang]}
                    </span>
                    <div className="flex flex-row flex-wrap gap-x-2 gap-y-1">
                      {nd.own ? (
                        <Badge variant="secondary" className="border-primary">
                          <SmileIcon className="w-3 h-3 mr-2" />{" "}
                          {L10N_COMMON.my[lang]}
                        </Badge>
                      ) : (
                        nd.createdAt >
                          new Date(
                            new Date().getTime() - 1000 * 60 * 60 * 24 * 7
                          ) && (
                          <Badge>
                            <Star className="w-3 h-3 mr-2" /> Ny!
                          </Badge>
                        )
                      )}
                      <Badge variant="secondary">
                        <MapPin className="w-3 h-3 mr-2" />
                        {(nd.region.l10nName as L10nText)[lang]}
                      </Badge>
                      <Badge variant="secondary">
                        <Calendar className="w-3 h-3 mr-2" />
                        {nd.startDate.toLocaleDateString("fi")}
                        <ArrowRightIcon className="w-3 h-3 mx-2" />
                        {nd.endDate.toLocaleDateString("fi")}
                      </Badge>
                      <Badge variant="secondary">
                        <div
                          className={cn(
                            "flex flex-row gap",
                            nd.amount < 0
                              ? `text-orange-700 dark:text-orange-400`
                              : `text-teal-700 dark:text-teal-400`
                          )}
                        >
                          {new Array(Math.abs(nd.amount))
                            .fill(null)
                            .slice(0, 3)
                            .map((_, i) =>
                              i == 2 ? (
                                <Plus key={i} className="w-3 h-3" />
                              ) : (
                                <UserRound key={i} className="w-3 h-3" />
                              )
                            )}
                        </div>
                      </Badge>
                    </div>
                  </div>
                  {nd.competence.iconUrl && (
                    <div className="absolute right-0 top-0 bottom-0 w-24">
                      <Image
                        className={cn(
                          "relative object-contain object-center mix-blend-multiply scale-[220%] contrast-200 -mr-6 group-hover:mr-0 group-hover:opacity-100 group-hover:scale-150 dark:invert dark:mix-blend-screen duration-300",
                          false ? "opacity-25" : "opacity-5"
                        )}
                        src={nd.competence.iconUrl}
                        alt={(nd.competence.l10nName as L10nText)[lang]}
                        fill
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  )
}
