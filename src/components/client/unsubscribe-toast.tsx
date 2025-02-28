"use client"

import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export const UnsubscribeToast = () => {
  const params = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    if (params.get("unsubscribed") !== "true") return
    // Todo: Localization
    toast({
      title: "Vad trist!",
      description: "Du har avregistrerat dig från vårt nyhetsbrev.",
    })
  }, [])

  return null
}
