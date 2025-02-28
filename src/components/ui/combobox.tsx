"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { CheckIcon, PlusIcon } from "lucide-react"
import { cn } from "@/utils/ui"
import { L10N_COMMON } from "@/l10n/l10n-common"
import { Language } from "@/types/language"

interface Option {
  value: string
  label: string
}

export const ComboBox = ({
  allowArbitraryValue,
  options,
  selectedOptionValue,
  onPickOptionValue,
  disabled,
  lang,
}: {
  allowArbitraryValue?: {
    onPickArbitraryValue: (value: string) => void
  }
  options: Option[]
  selectedOptionValue: string | null
  onPickOptionValue: (option: string | null) => void
  disabled?: boolean
  lang: Language
}) => {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const selectedOption =
    options.find((option) => option.value === selectedOptionValue) ?? null

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={disabled}
          >
            <PlusIcon className="mr-2 w-4 h-4" />
            {selectedOption ? (
              <>{selectedOption.label}</>
            ) : allowArbitraryValue ? (
              L10N_COMMON.searchOrCreateByTyping[lang]
            ) : (
              L10N_COMMON.searchEllipsis[lang]
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" p-0" align="start">
          <OptionList
            allowArbitraryValue={allowArbitraryValue}
            options={options}
            selectedOptionValue={selectedOptionValue}
            setOpen={setOpen}
            onPickOptionValue={onPickOptionValue}
            lang={lang}
          />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start"
          disabled={disabled}
        >
          <PlusIcon className="mr-2 w-4 h-4" />
          {selectedOption ? (
            <>{selectedOption.label}</>
          ) : allowArbitraryValue ? (
            L10N_COMMON.searchOrCreateByTyping[lang]
          ) : (
            L10N_COMMON.searchEllipsis[lang]
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OptionList
            allowArbitraryValue={allowArbitraryValue}
            options={options}
            selectedOptionValue={selectedOptionValue}
            setOpen={setOpen}
            onPickOptionValue={onPickOptionValue}
            lang={lang}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

const OptionList = ({
  allowArbitraryValue,
  options,
  selectedOptionValue,
  setOpen,
  onPickOptionValue,
  lang,
}: {
  allowArbitraryValue?: {
    onPickArbitraryValue: (value: string) => void
  }
  options: Option[]
  setOpen: (open: boolean) => void
  selectedOptionValue: string | null
  onPickOptionValue: (option: string | null) => void
  lang: Language
}) => {
  const [searchValue, setSearchValue] = useState("")

  return (
    <Command>
      <CommandInput
        placeholder="Filter option..."
        onValueChange={(v) => setSearchValue(v)}
      />
      <CommandList>
        <CommandEmpty>{L10N_COMMON.noResultsFound[lang]}</CommandEmpty>
        <CommandGroup>
          {selectedOptionValue && (
            <CommandItem key={selectedOptionValue}>
              <CheckIcon className={"mr-2 h-4 w-4"} />

              {
                options.find((option) => option.value === selectedOptionValue)
                  ?.label
              }
            </CommandItem>
          )}

          {options.map((option) =>
            selectedOptionValue === option.value ? null : (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => {
                  onPickOptionValue(option.value)
                  setOpen(false)
                }}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    option.value === selectedOptionValue
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />

                {option.label}
              </CommandItem>
            )
          )}
        </CommandGroup>
        {allowArbitraryValue && searchValue.length > 2 ? (
          <div className="w-full p-2">
            <Button
              onClick={() => {
                allowArbitraryValue.onPickArbitraryValue(searchValue)
                setOpen(false)
              }}
              variant="ghost"
              className="justify-start w-full"
            >
              <PlusIcon className="mr-4" /> {L10N_COMMON.create[lang]} {'"'}
              {searchValue}
              {'"'}
            </Button>
          </div>
        ) : null}
      </CommandList>
    </Command>
  )
}
