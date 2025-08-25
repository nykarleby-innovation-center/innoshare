"use client"

import {
  ArrowRightIcon,
  BuildingIcon,
  Calendar,
  CheckCircleIcon,
  CheckIcon,
  ChevronsLeftRight,
  ChevronsRightLeft,
  MapPin,
  Plus,
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

type SortType =
  | "newestFirst"
  | "oldestFirst"
  | "supplyFirst"
  | "needsFirst"
  | "byRegion"

type Show = "all" | "supply" | "need" | "mine" | "completed"

export const BalanceListing = ({
  defaultShow,
  lang,
  publicOrganizationBalances,
  balances,
}: {
  defaultShow?: Show
  lang: Language
  publicOrganizationBalances: Array<{
    organizationId: string
    organizationName: string
    balanceIds: string[]
  }>
  balances: Array<
    Pick<
      Prisma.Balance,
      | "id"
      | "createdAt"
      | "amount"
      | "startDate"
      | "endDate"
      | "completedBalanceId"
    > & {
      competence: Pick<Prisma.Competence, "l10nName" | "iconUrl">
      region: Pick<Prisma.Region, "l10nName">
      own: boolean
    }
  >
}) => {
  const [showFrom, setShowFrom] = useState<string>("_")
  const [sortBy, setSortBy] = useState<SortType>("newestFirst")
  const [show, setShow] = useState<Show>(defaultShow ?? "all")
  const [search, setSearch] = useState("")

  const filteredBalances = balances
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
    // show completed ones last
    .sort((a, b) => (a.completedBalanceId ? 1 : 0))
    .filter(
      (nd) =>
        (show === "all"
          ? true
          : show === "mine"
          ? nd.own
          : show === "completed"
          ? nd.completedBalanceId
          : show === "need"
          ? nd.amount < 0
          : show === "supply" && nd.amount > 0) &&
        (search.length === 0
          ? true
          : (nd.competence.l10nName as L10nText)[lang]
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            (nd.region.l10nName as L10nText)[lang]
              .toLowerCase()
              .includes(search.toLowerCase())) &&
        (showFrom === "_"
          ? true
          : showFrom ===
            publicOrganizationBalances.find((b) => b.balanceIds.includes(nd.id))
              ?.organizationId)
    )

  return (
    <>
      <div className="flex flex-col items-start w-full">
        <div className="flex flex-col items-stretch gap-4 w-full mb-8">
          <div className="flex-grow flex gap-2 flex-col md:flex-row">
            <Select
              value={showFrom}
              onValueChange={(v) => setShowFrom(v as SortType)}
            >
              <SelectTrigger className="lg:w-48">
                <SelectValue placeholder={L10N_COMMON.organization[lang]} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{L10N_COMMON.organization[lang]}</SelectLabel>
                  <SelectItem value={"_"}>
                    {L10N_COMMON.allOrganizations[lang]}
                  </SelectItem>
                  {publicOrganizationBalances.map((p) => (
                    <SelectItem value={p.organizationId} key={p.organizationId}>
                      {p.organizationName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as SortType)}
            >
              <SelectTrigger className="lg:w-48">
                <SelectValue placeholder={L10N_COMMON.sortBy[lang]} />
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
            <div className="flex min-w-4 flex-grow" />
            <Input
              className="flex-grow lg:w-48"
              placeholder={L10N_COMMON.searchEllipsis[lang]}
              value={search}
              onChange={(v) => setSearch(v.target.value)}
            />
          </div>
          <ToggleGroup
            className="justify-start items-stretch grid grid-cols-2 gap-2 md:flex md:flex-row"
            type="single"
          >
            <Toggle
              variant="outline"
              className="col-span-2"
              pressed={show === "all"}
              onPressedChange={() => setShow("all")}
            >
              {L10N_COMMON.showAll[lang]}
            </Toggle>
            <Toggle
              variant="outline"
              pressed={show === "need"}
              onPressedChange={() => setShow("need")}
            >
              <ChevronsRightLeft
                className={cn(
                  "mr-2 h-4 w-4 mb-0.5",
                  show === "need"
                    ? "text-orange-700 dark:text-orange-400"
                    : null
                )}
              />
              {L10N_COMMON.showNeeds[lang]}
            </Toggle>
            <Toggle
              variant="outline"
              pressed={show === "supply"}
              onPressedChange={() => setShow("supply")}
            >
              <ChevronsLeftRight
                className={cn(
                  "mr-2 h-4 w-4 mb-0.5",
                  show === "supply" ? "text-teal-700 dark:text-teal-400" : null
                )}
              />
              {L10N_COMMON.showSupply[lang]}
            </Toggle>
            {balances.some((b) => b.own) && (
              <Toggle
                variant="outline"
                pressed={show === "mine"}
                onPressedChange={() => setShow("mine")}
              >
                <SmileIcon className="mr-2 h-4 w-4" />
                {L10N_COMMON.showMine[lang]}
              </Toggle>
            )}
            <Toggle
              variant="outline"
              pressed={show === "completed"}
              onPressedChange={() => setShow("completed")}
            >
              <CheckIcon className="mr-2 h-4 w-4" />
              {L10N_COMMON.showCompleted[lang]}
            </Toggle>
          </ToggleGroup>
        </div>

        <div className="grid grid-cols-1 w-full gap-6 lg:grid-cols-3">
          {filteredBalances.map((nd) => {
            const isPublic = publicOrganizationBalances.find((b) =>
              b.balanceIds.includes(nd.id)
            )

            return (
              <Link
                className="flex"
                href={`/${lang}/balance/${nd.id}`}
                key={nd.id}
              >
                <div
                  className={cn(
                    "relative w-full rounded-lg overflow-hidden bg-gradient-to-b from-secondary/20 to-secondary/40 p-4 group flex flex-row gap-8 duration-200 border hover:from-secondary/40 hover:to-secondary hover:cursor-pointer",
                    nd.createdAt >
                      new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
                      ? nd.completedBalanceId
                        ? "border-transparent"
                        : nd.amount < 0
                        ? `border-orange-500 shadow-md shadow-orange-500/20`
                        : `border-teal-500 shadow-md shadow-teal-500/20`
                      : `border-transparent`,
                    nd.completedBalanceId
                      ? ""
                      : nd.amount < 0
                      ? `border-l-8 border-l-orange-500`
                      : `border-l-8 border-l-teal-500`
                  )}
                >
                  <div
                    className={cn(
                      "flex flex-grow flex-col justify-between",
                      (nd.competence.l10nName as L10nText)[lang].length > 30
                        ? ""
                        : "mr-24"
                    )}
                  >
                    <span
                      className={cn(
                        "uppercase leading-snug font-black flex flex-row gap-2",
                        (nd.competence.l10nName as L10nText)[lang].length > 30
                          ? "text-md leading-tight"
                          : "text-xl"
                      )}
                    >
                      {nd.completedBalanceId ? (
                        <CheckCircleIcon
                          className={cn(
                            "mr-2",
                            nd.amount < 0 ? "text-orange-500" : "text-teal-500"
                          )}
                        />
                      ) : null}
                      {(nd.competence.l10nName as L10nText)[lang]}
                    </span>
                    {isPublic && (
                      <div className="flex flex-row items-center gap-2 mb-4 mt-2 text-xs">
                        <BuildingIcon className="w-4 h-4 -mt-1" />
                        {L10N_COMMON.via[lang]} {isPublic.organizationName}
                      </div>
                    )}

                    <div className="mt-2 flex flex-row flex-wrap gap-x-2 gap-y-1">
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
                      {nd.completedBalanceId ? (
                        <Badge variant="secondary">
                          <CheckIcon className="w-3 h-3 mr-2" />{" "}
                          {nd.amount > 0
                            ? L10N_COMMON.completedSupply[lang]
                            : L10N_COMMON.completedNeed[lang]}
                        </Badge>
                      ) : (
                        <>
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
                        </>
                      )}
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
            )
          })}
        </div>
      </div>
    </>
  )
}
