"use client"

import React, { useEffect, useRef, useState } from "react"

interface InfiniteCanvasProps {
  children: React.ReactNode
}

export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [spacePressed, setSpacePressed] = useState(false)
  const lastPos = useRef({ x: 0, y: 0 })

  // Det
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement
      const activeTag = document.activeElement?.tagName.toLowerCase()
      const isInEditor = activeEl?.classList.contains("ProseMirror")

      if (
        e.code === "Space" &&
        activeTag !== "textarea" &&
        activeTag !== "input" &&
        !isInEditor
      ) {
        e.preventDefault()
        setSpacePressed(true)
      }
      if (e.ctrlKey && e.key.toLowerCase() === "f") {
        e.preventDefault()
        setScale(1)
        setOffset({ x: 0, y: 0 })
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const activeEl = document.activeElement
      const activeTag = document.activeElement?.tagName.toLowerCase()
      const isInEditor = activeEl?.classList.contains("ProseMirror")

      if (
        e.code === "Space" &&
        activeTag !== "textarea" &&
        activeTag !== "input" &&
        !isInEditor
      ) {
        e.preventDefault()
        setSpacePressed(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Pan with mouse
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (spacePressed && e.button === 0) {
        const editorEl = document.querySelector(".ProseMirror")
        if (!editorEl?.contains(e.target as Node)) {
          setIsPanning(true)
          lastPos.current = { x: e.clientX, y: e.clientY }
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        const dx = e.clientX - lastPos.current.x
        const dy = e.clientY - lastPos.current.y
        setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
        lastPos.current = { x: e.clientX, y: e.clientY }
      }
    }

    const handleMouseUp = () => setIsPanning(false)

    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isPanning, spacePressed])

  // Zoom with scroll + Ctrl
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return
      e.preventDefault()
      setScale((prev) => {
        const newScale = e.deltaY > 0 ? prev * 0.9 : prev * 1.1
        return Math.min(Math.max(newScale, 0.2), 3)
      })
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      <div
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          width: "100%",
          height: "100%",
          position: "relative",
          cursor: spacePressed ? "grab" : "default",
        }}
      >
        {children}
      </div>
    </div>
  )
}
