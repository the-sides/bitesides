import * as React from "react"

import {
  Example,
  LandingRow,
} from "@/components/example"
import { Reviews } from "./reviews"
import { TextTypewriter } from "@/components/typewriter"
import {} from "@/components/CurvedLoop.css"
import CurvedLoop from "./CurvedLoop"
import type { Review } from "@/lib/notion"

interface ComponentExampleProps {
  reviews: Review[];
}

export function ComponentExample({ reviews }: ComponentExampleProps) {
  return (
    <>
      <LandingRow>
        <PhotoScrapBook />
        <Heading />
      </LandingRow>
      <div className="absolute fade-in animate-in duration-2000 top-0 w-full h-[20vh]">
        <CurvedLoop speed={1} marqueeText="I know it's 11 but we should get Cane's ✦" />
      </div>
      <div className="px-4 pb-8 sm:px-6">

        <Example containerClassName="col-span-2" className="flex flex-col" title="Reviews">
           <Reviews reviews={reviews} />
        </Example>
      </div>
    </>
  )
}

function PhotoScrapBook() {
  return (
    <Example containerClassName="absolute fade-in animate-in duration-2000 relative z-10 col-span-1 order-last md:order-none" title="Photos" className="w-3/4 lg:w-auto lg:min-h-[50vh] col-span-1 grid grid-cols-12 grid-rows-2 items-center justify-center">
      <img className="col-start-1 col-end-7 row-start-1 row-end-4 object-cover p-2 border border-dashed" src='/herFood.jpg'></img>
      <img className="col-start-6 col-end-13 z-10 row-start-3 row-end-6 object-cover p-2 border border-dashed" src='/meFood.jpg'></img>
    </Example>
  )
}

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

function Heading() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = React.useState("light")

  return (
    <Example containerClassName="col-span-2" className="flex flex-col" title="Heading">
      
      <TextTypewriter className="text-6xl md:text-8xl lg:text-9xl font-bold">BiteSides</TextTypewriter>
      <TextTypewriter delay={1} speed={50} className="pl-1.5 text-lg">A food blog by the extremely unqualified. We're a couple in Chattanooga that love to eat. We particularly enjoy Japanese, Fried Chicken, Brunch and Limoncellos</TextTypewriter>
    </Example>
  )
}
