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

interface Option {
  value: string
  label: string
}

export function ComboBox({
  allowArbitraryValue,
  options,
  selectedOptionValue,
  onPickOptionValue,
  disabled
}: {
  allowArbitraryValue?: {
    onPickArbitraryValue: (value: string) => void
  }
  options: Option[]
  selectedOptionValue: string | null
  onPickOptionValue: (option: string | null) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const selectedOption =
    options.find((option) => option.value === selectedOptionValue) ?? null

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start" disabled={disabled}>
            {selectedOption ? <>{selectedOption.label}</> : <>+ Set option</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" p-0" align="start">
          <OptionList
            allowArbitraryValue={allowArbitraryValue}
            options={options}
            selectedOptionValue={selectedOptionValue}
            setOpen={setOpen}
            onPickOptionValue={onPickOptionValue}
          />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-start" disabled={disabled}>
          {selectedOption ? <>{selectedOption.label}</> : <>+ Set option</>}
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
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function OptionList({
  allowArbitraryValue,
  options,
  selectedOptionValue,
  setOpen,
  onPickOptionValue,
}: {
  allowArbitraryValue?: {
    onPickArbitraryValue: (value: string) => void
  }
  options: Option[]
  setOpen: (open: boolean) => void
  selectedOptionValue: string | null
  onPickOptionValue: (option: string | null) => void
}) {
  const [searchValue, setSearchValue] = useState("")

  console.log(searchValue)

  return (
    <Command>
      <CommandInput
        placeholder="Filter option..."
        onValueChange={(v) => setSearchValue(v)}
      />
      <CommandList>
        <CommandEmpty>
          {allowArbitraryValue ? (
            <Button
              onClick={() => {
                allowArbitraryValue.onPickArbitraryValue(searchValue)
                setOpen(false)
              }}
            >
              <PlusIcon className="mr-4" /> Skapa {'"'}{searchValue}{'"'}
            </Button>
          ) : (
            "No results found."
          )}
        </CommandEmpty>
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
      </CommandList>
    </Command>
  )
}
