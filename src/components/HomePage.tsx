import { Section, HeroRow } from "@/components/sections"
import { Reviews } from "./reviews"
import { TextTypewriter } from "@/components/typewriter"
import CurvedLoop from "./CurvedLoop"
import CircularText from "./CircularText"
import type { Review } from "@/lib/notion"

import "@/components/CurvedLoop.css"

interface HomePageProps {
  reviews: Review[];
}

export function HomePage({ reviews }: HomePageProps) {
  return (
    <main className="w-screen overflow-x-hidden">
      <HeroRow>
        <PhotoGallery />
        <HeroHeading />
      </HeroRow>
      <div className="opacity-25 absolute fade-in animate-in duration-2000 top-0 w-full h-[20vh]">
        <CurvedLoop speed={1} marqueeText="I know it's 11 but we should get Cane's ✦" />
      </div>
      <div className="px-4 pb-8 sm:px-6">
        <Section containerClassName="col-span-2" className="flex flex-col" title="Reviews">
          <Reviews reviews={reviews} />
        </Section>
      </div>
    </main>
  )
}

function PhotoGallery() {
  return (
    <Section containerClassName="absolute fade-in animate-in duration-2000 relative z-10 col-span-1 order-last md:order-none" title="Photos" className="w-3/4 lg:w-auto lg:min-h-[50vh] col-span-1 grid grid-cols-12 grid-rows-2 items-center justify-center">
      <img className="col-start-1 col-end-7 row-start-1 row-end-4 object-cover p-2 border border-dashed" src='/herFood.jpg' alt="Food photo" />
      <img className="col-start-6 col-end-13 z-10 row-start-3 row-end-6 object-cover p-2 border border-dashed" src='/meFood_small.jpg' alt="Food photo" />
    </Section>
  )
}

function HeroHeading() {
  return (
    <Section containerClassName="col-span-2 relative" className="flex flex-col" title="Heading">
      <TextTypewriter className="text-6xl md:text-8xl lg:text-9xl font-bold">BiteSides</TextTypewriter>
      <TextTypewriter delay={1} speed={50} className="pl-1.5 text-lg max-w-sm pr-12">A food blog by the extremely unqualified. We're a couple in Chattanooga that love to eat. We particularly enjoy Japanese, Fried Chicken, Brunch and Limoncellos</TextTypewriter>
      <div className="absolute top-1/2 -translate-y-1/2 -right-[200px]">
        <CircularText
          text="🍜 yummy • 🍗 crispy • 🥞 brunch • 🍋 zesty • "
          className="scale-[1.75] md:scale-[3] font-mono dtracking-[4em]"
          spinDuration={32}
          gap={3}
          onHover="speedUp"
        />
      </div>
    </Section>
  )
}
