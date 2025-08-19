"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

type HoldToConfirmButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "onPointerDown" | "onPointerUp" | "onPointerLeave" | "onPointerCancel"
> & {
  onConfirm: () => void | Promise<void>
  durationMs?: number
  holdingLabel?: string
  idleLabel?: string
  progressClassName?: string
}

export function HoldToConfirmButton(props: HoldToConfirmButtonProps) {
  const {
    onConfirm,
    durationMs = 1000,
    holdingLabel = "Hold to confirm",
    idleLabel = "Hold to confirm",
    className,
    disabled,
    progressClassName,
    children,
    ...buttonProps
  } = props

  const [isHolding, setIsHolding] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const rafRef = React.useRef<number | null>(null)
  const startTimeRef = React.useRef<number | null>(null)

  const stop = React.useCallback(() => {
    setIsHolding(false)
    setProgress(0)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    startTimeRef.current = null
  }, [])

  const start = React.useCallback(() => {
    if (disabled) return
    setIsHolding(true)
    startTimeRef.current = performance.now()
    const step = (now: number) => {
      if (!startTimeRef.current) return
      const elapsed = now - startTimeRef.current
      const pct = Math.min(100, (elapsed / durationMs) * 100)
      setProgress(pct)
      if (elapsed >= durationMs) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = null
        startTimeRef.current = null
        setIsHolding(false)
        setProgress(100)
        void Promise.resolve(onConfirm()).finally(() => {
          setProgress(0)
        })
        return
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }, [disabled, durationMs, onConfirm])

  React.useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <Button
      {...buttonProps}
      className={cn("relative overflow-hidden select-none", className)}
      disabled={disabled}
      onPointerDown={(e) => {
        e.preventDefault()
        start()
      }}
      onPointerUp={(e) => {
        e.preventDefault()
        stop()
      }}
      onPointerLeave={() => stop()}
      onPointerCancel={() => stop()}
    >
      <span className="relative z-10">
        {children ?? (isHolding ? holdingLabel : idleLabel)}
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 left-0 top-0 h-full bg-white/20 z-0",
          progressClassName
        )}
        style={{ width: `${progress}%` }}
      />
    </Button>
  )
}
