"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/src/lib/utils"

function TooltipProvider({ ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" {...props} />
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipPortal({ ...props }: TooltipPrimitive.Portal.Props) {
  return <TooltipPrimitive.Portal data-slot="tooltip-portal" {...props} />
}

function TooltipPositioner({
  className,
  ...props
}: TooltipPrimitive.Positioner.Props) {
  return (
    <TooltipPrimitive.Positioner
      data-slot="tooltip-positioner"
      className={cn("z-50", className)}
      {...props}
    />
  )
}

function TooltipContent({
  className,
  ...props
}: TooltipPrimitive.Popup.Props) {
  return (
    <TooltipPrimitive.Popup
      data-slot="tooltip-content"
      className={cn(
        "z-[100] max-w-xs rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md transition duration-150 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-starting-style:scale-95",
        className
      )}
      {...props}
    />
  )
}

function TooltipArrow({ className, ...props }: TooltipPrimitive.Arrow.Props) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={cn("fill-popover stroke-border", className)}
      {...props}
    />
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipPositioner,
  TooltipArrow,
  TooltipProvider,
}
