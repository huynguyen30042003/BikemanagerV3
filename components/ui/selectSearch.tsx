"use client"

import { Check, ChevronDown, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Input } from "./input"

type SelectValue = string | number

type SelectOption = {
  value: SelectValue
  label: string
}

/* =========================
   Hook click outside
========================= */

function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        callback()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, callback])
}

/* =========================
   Search Select
========================= */

function SearchSelect({
  value,
  options,
  placeholder = "Chọn",
  onChange,
  className,
}: {
  value?: SelectValue
  options: SelectOption[]
  placeholder?: string
  onChange?: (value: SelectValue | "") => void
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const containerRef = useRef<HTMLDivElement>(null)

  useClickOutside(containerRef, () => {
    setOpen(false)
    setQuery("")
  })

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  )

  const selectedOption = options.find(
    (option) => option.value === value
  )

  function handleSelect(option: SelectOption) {
    onChange?.(option.value)

    setOpen(false)
    setQuery("")
  }

  function handleClear(event: React.MouseEvent) {
    event.stopPropagation()
    onChange?.("")
    setQuery("")
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className ?? ""}`}
    >
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-300 bg-card px-3 text-left text-sm text-slate-800 outline-none focus:border-[#9b9287] focus:ring-2 focus:ring-[#f7f5f1]"
        aria-expanded={open}
      >
        <span
          className={
            selectedOption
              ? "text-slate-800"
              : "text-slate-400"
          }
        >
          {selectedOption?.label || placeholder}
        </span>

        <div className="flex items-center gap-1">
          {selectedOption && (
            <X
              className="size-4 cursor-pointer text-slate-500 hover:text-red-500"
              onClick={handleClear}
            />
          )}

          <ChevronDown
            aria-hidden="true"
            className={`size-4 text-slate-700 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 z-20 mt-1 rounded-lg border border-slate-200 bg-card p-2 shadow-lg">
          {/* Search */}
          <Input
            autoFocus
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Tìm kiếm..."
            className="mb-2 h-9 w-full rounded-md border border-slate-300 px-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            aria-label="Tìm kiếm lựa chọn"
          />

          {/* Options */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected =
                  option.value === value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm ${
                      isSelected
                        ? "bg-[#f7f5f1] font-bold text-primary"
                        : "text-primary hover:bg-[#f7f5f1]"
                    }`}
                  >
                    <span>{option.label}</span>

                    {isSelected && (
                      <Check
                        aria-hidden="true"
                        className="size-4 text-blue-600"
                      />
                    )}
                  </button>
                )
              })
            ) : (
              <p className="px-2.5 py-2 text-sm text-slate-500">
                Không tìm thấy kết quả
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* =========================
   Multi Search Select
========================= */

function MultiSearchSelect({
  value = [],
  options,
  placeholder = "Chọn",
  onChange,
}: {
  value?: SelectValue[]
  options: SelectOption[]
  placeholder?: string
  onChange?: (values: SelectValue[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const containerRef = useRef<HTMLDivElement>(null)

  useClickOutside(containerRef, () => {
    setOpen(false)
    setQuery("")
  })

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  )

  function toggleOption(optionValue: SelectValue) {
    const nextValues = value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue]

    onChange?.(nextValues)
  }

  function getOptionLabel(
    optionValue: SelectValue
  ) {
    return (
      options.find(
        (option) => option.value === optionValue
      )?.label ?? String(optionValue)
    )
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        aria-expanded={open}
      >
        <span
          className={
            value.length
              ? "flex flex-wrap gap-1"
              : "text-slate-400"
          }
        >
          {value.length > 0
            ? value.map((item) => (
                <span
                  key={item}
                  className="rounded bg-blue-50 px-2 py-0.5 text-blue-700"
                >
                  {getOptionLabel(item)}
                </span>
              ))
            : placeholder}
        </span>

        <ChevronDown
          aria-hidden="true"
          className={`size-4 shrink-0 text-slate-700 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 z-20 mt-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          {/* Search */}
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Tìm kiếm..."
            className="mb-2 h-9 w-full rounded-md border border-slate-300 px-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            aria-label="Tìm kiếm lựa chọn"
          />

          {/* Options */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value.includes(
                  option.value
                )

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      toggleOption(option.value)
                    }
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-slate-800 hover:bg-blue-50"
                  >
                    {/* Checkbox */}
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          aria-hidden="true"
                          className="size-3"
                        />
                      )}
                    </span>

                    <span>{option.label}</span>
                  </button>
                )
              })
            ) : (
              <p className="px-2.5 py-2 text-sm text-slate-500">
                Không tìm thấy kết quả
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* =========================
   Export
========================= */

export {
  SearchSelect,
  MultiSearchSelect,
}

export type {
  SelectOption,
  SelectValue,
}