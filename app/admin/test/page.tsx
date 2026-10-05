// "use client";

// import { addDays, format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { type DateRange } from "react-day-picker";

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Field, FieldLabel } from "@/components/ui/field";
// import {
// 	Popover,
// 	PopoverContent,
// 	PopoverTrigger,
// } from "@/components/ui/popover";
// import { useEffect, useState } from "react";

// function page() {
// 	const [date, setDate] = useState<DateRange | undefined>({
// 		from: new Date(),
// 		to: addDays(new Date(), 20),
// 	});
// 	useEffect(() => {
// 		console.log(!!date?.from ? format(date.from, "dd/MM/yyyy") : "");
// 		console.log(!!date?.to ? format(date.to, "dd/MM/yyyy") : "");
// 	}, [date]);
// 	return (
// 		<Field className="mx-auto w-60">
// 			<FieldLabel htmlFor="date-picker-range">
// 				Khoảng thời gian
// 			</FieldLabel>

// 			<Popover>
// 				<PopoverTrigger asChild>
// 					<Button
// 						variant="outline"
// 						id="date-picker-range"
// 						className="justify-start px-2.5 font-normal w-full"
// 					>
// 						<CalendarIcon />

// 						{date?.from ? (
// 							date.to ? (
// 								<>
// 									{format(date.from, "dd/MM/yyyy")} -{" "}
// 									{format(date.to, "dd/MM/yyyy")}
// 								</>
// 							) : (
// 								format(date.from, "dd/MM/yyyy")
// 							)
// 						) : (
// 							<span>Chọn ngày</span>
// 						)}
// 					</Button>
// 				</PopoverTrigger>

// 				<PopoverContent className="w-auto p-0" align="start">
// 					<Calendar
// 						mode="range"
// 						defaultMonth={date?.from}
// 						selected={date}
// 						onSelect={setDate}
// 						numberOfMonths={2}
// 						showOutsideDays={false}
// 					/>
// 				</PopoverContent>
// 			</Popover>
// 		</Field>
// 	);
// }

// export default page;
"use client"

import * as React from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"

const deliveryTimes = [
  {
    value: "asap",
    id: "delivery-asap",
    label: "Standard delivery",
    description: "25–35 min · Driver assigned now",
    badge: "Fastest",
  },
  {
    value: "5-00",
    id: "delivery-5-00",
    label: "5:00 PM – 5:15 PM",
    description: "Prep starts at 4:45 PM",
  },
  {
    value: "5-30",
    id: "delivery-5-30",
    label: "5:30 PM – 5:45 PM",
    description: "Good if you're heading home",
  },
  {
    value: "6-00",
    id: "delivery-6-00",
    label: "6:00 PM – 6:15 PM",
    description: "Most popular · High demand",
  },
  {
    value: "6-30",
    id: "delivery-6-30",
    label: "6:30 PM – 6:45 PM",
    description: "Last slot before kitchen closes",
  },
]

export function DrawerDemo() {
  const [open, setOpen] = React.useState(false)
  const [deliveryTime, setDeliveryTime] = React.useState("asap")

  function handleConfirm() {
    const selected = deliveryTimes.find((time) => time.value === deliveryTime)

    if (!selected) {
      return
    }

    setOpen(false)
    toast("Delivery time confirmed", {
      description: selected.label,
    })
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger>
        <Button variant="secondary">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Pick a delivery time</DrawerTitle>
          <DrawerDescription>
            We&apos;ll prepare your order as soon as possible.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 scroll-fade overflow-y-auto p-4">
       
            {deliveryTimes.map((time) => (
              <FieldLabel key={time.value} htmlFor={time.id}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle className="flex items-center gap-2">
                      {time.label}
                      {time.badge ? (
                        <Badge variant="secondary">{time.badge}</Badge>
                      ) : null}
                    </FieldTitle>
                    <FieldDescription>{time.description}</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            ))}
        </div>
        <DrawerFooter>
          <Button onClick={handleConfirm} className="h-[34px]">
            Confirm Delivery Time
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>	
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
