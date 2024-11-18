"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/utils/ui"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { Language } from "@/types/language"

export function DateRangePicker({
  lang,
  className,
  dateRange,
  onPickDateRange,
}: {
  lang: Language
  dateRange: DateRange | null
  onPickDateRange: (dateRange: DateRange) => void
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {dateRange.from.toLocaleDateString("fi")} -{" "}
                  {dateRange.to.toLocaleDateString("fi")}
                </>
              ) : (
                dateRange.from.toLocaleDateString()
              )
            ) : (
              <span>{L10N_COMMON.pickADateRange[lang]}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange ?? undefined}
            onSelect={(v) => v && onPickDateRange(v)}
            numberOfMonths={2}
            showWeekNumber
            fromDate={
              new Date(+new Date() - 1000 * 60 * 60 * 24 * 365)
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
