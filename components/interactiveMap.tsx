"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Compass, Sparkles, Feather } from "lucide-react";

const mapPins = [
  { id: 1, top: "25%", left: "30%", label: "Rajasthan", stories: 45 },
  { id: 2, top: "35%", left: "55%", label: "Delhi", stories: 32 },
  { id: 3, top: "45%", left: "70%", label: "Bengal", stories: 28 },
  { id: 4, top: "55%", left: "35%", label: "Gujarat", stories: 38 },
  { id: 5, top: "70%", left: "50%", label: "Karnataka", stories: 52 },
  { id: 6, top: "75%", left: "65%", label: "Tamil Nadu", stories: 67 },
];

export function InteractiveMap() {
  return (
    <section className="py-20 lg:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Vintage Scroll Container */}
        <div className="relative">
          {/* Top Scroll Roll */}
          <div className="relative z-10 flex justify-center">
            <div className="w-full max-w-4xl">
              {/* Wooden rod */}
              <div className="h-6 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 rounded-full shadow-lg" />
              {/* Roll shadow */}
              <div className="h-4 bg-gradient-to-b from-amber-950/60 to-transparent rounded-b-full mx-4" />
            </div>
          </div>

          {/* Main Scroll Paper */}
          <div
            className="relative -mt-2 mx-auto max-w-4xl"
            style={{
              background:
                "linear-gradient(to bottom, #d4a574 0%, #e8d4b8 5%, #f5e6d3 15%, #faf3e8 50%, #f5e6d3 85%, #e8d4b8 95%, #d4a574 100%)",
            }}
          >
            {/* Paper texture overlay */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Burnt/aged edges effect */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-amber-900/20 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-amber-900/20 to-transparent" />

            {/* Decorative corner flourishes */}
            <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-amber-800/40 rounded-tl-lg" />
            <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-amber-800/40 rounded-tr-lg" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-amber-800/40 rounded-bl-lg" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-amber-800/40 rounded-br-lg" />

            {/* Content */}
            <div className="relative px-8 py-12 md:px-16 md:py-16">
              {/* Header with quill icon */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-900/10 mb-4">
                  <Feather className="h-6 w-6 text-amber-800" />
                </div>
                <h2
                  className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-amber-950"
                  style={{ fontStyle: "italic" }}
                >
                  The Heritage Map of Bharat
                </h2>
                <p className="text-amber-800/80 mt-3 max-w-lg mx-auto font-serif text-lg">
                  Wherein lies marked the ancient monuments and sacred sites of
                  our civilization
                </p>
                {/* Decorative line */}
                <div className="flex items-center justify-center gap-3 mt-6">
                  <div className="h-px w-16 bg-amber-800/30" />
                  <div className="w-2 h-2 rotate-45 bg-amber-800/40" />
                  <div className="h-px w-16 bg-amber-800/30" />
                </div>
              </div>

              {/* Map Area */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border-4 border-amber-800/20 shadow-inner">
                <Image
                  src="/images/india-map.jpg"
                  alt="Heritage map of India"
                  fill
                  className="object-cover sepia"
                  style={{ filter: "sepia(0.6) contrast(0.9) brightness(1.1)" }}
                />
                {/* Vignette overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, transparent 40%, rgba(139, 90, 43, 0.3) 100%)",
                  }}
                />

                {/* Vintage Map Pins */}
                {mapPins.map((pin) => (
                  <div
                    key={pin.id}
                    className="absolute group cursor-pointer"
                    style={{ top: pin.top, left: pin.left }}
                  >
                    {/* Vintage pin marker */}
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-amber-900 border-2 border-amber-700 flex items-center justify-center shadow-md group-hover:scale-125 transition-transform">
                        <MapPin className="h-3 w-3 text-amber-100" />
                      </div>
                      {/* Ink blot effect */}
                      <div className="absolute -inset-1 rounded-full bg-amber-900/20 blur-sm -z-10" />
                    </div>

                    {/* Vintage tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div
                        className="px-4 py-2 rounded shadow-lg whitespace-nowrap border border-amber-800/30"
                        style={{ backgroundColor: "#f5e6d3" }}
                      >
                        <p className="font-serif font-bold text-amber-950 text-sm italic">
                          {pin.label}
                        </p>
                        <p className="text-xs text-amber-800 flex items-center gap-1 mt-0.5">
                          <Sparkles className="h-3 w-3" />
                          {pin.stories} tales recorded
                        </p>
                        {/* Triangle pointer */}
                        <div
                          className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                          style={{ borderTopColor: "#d4a574" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Central cartouche */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="relative px-8 py-5 text-center shadow-lg border-2 border-amber-800/30"
                    style={{
                      backgroundColor: "#faf3e8",
                      clipPath:
                        "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
                    }}
                  >
                    <p className="font-serif text-3xl md:text-4xl font-bold text-amber-950 italic">
                      500+
                    </p>
                    <p className="text-amber-800 text-sm font-serif">
                      Unexplored Sites
                    </p>
                  </div>
                </div>

                {/* Compass rose */}
                <div className="absolute bottom-4 right-4 w-16 h-16 opacity-60">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#8b5a2b"
                      strokeWidth="1"
                    />
                    <path
                      d="M50 10 L55 45 L50 50 L45 45 Z"
                      fill="#8b5a2b"
                      className="drop-shadow"
                    />
                    <path
                      d="M50 90 L55 55 L50 50 L45 55 Z"
                      fill="#d4a574"
                      className="drop-shadow"
                    />
                    <path
                      d="M10 50 L45 45 L50 50 L45 55 Z"
                      fill="#d4a574"
                      className="drop-shadow"
                    />
                    <path
                      d="M90 50 L55 45 L50 50 L55 55 Z"
                      fill="#8b5a2b"
                      className="drop-shadow"
                    />
                    <text
                      x="50"
                      y="8"
                      textAnchor="middle"
                      fontSize="8"
                      fill="#8b5a2b"
                      fontFamily="serif"
                    >
                      N
                    </text>
                  </svg>
                </div>
              </div>

              {/* Stats in vintage style */}
              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: "29", label: "States Surveyed" },
                  { value: "40", label: "UNESCO Sites" },
                  { value: "3,500+", label: "ASI Monuments" },
                  { value: "10K+", label: "Tales Chronicled" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-serif text-2xl md:text-3xl font-bold text-amber-950 italic">
                      {stat.value}
                    </p>
                    <p className="text-sm text-amber-800/80 font-serif">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA Button - vintage style */}
              <div className="mt-10 flex justify-center">
                <Button className="bg-amber-900 text-amber-50 hover:bg-amber-800 font-serif text-base px-8 py-6 rounded-none border-2 border-amber-700 shadow-md">
                  <Compass className="h-5 w-5 mr-2" />
                  Discover Sites Near Thee
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Scroll Roll */}
          <div className="relative z-10 flex justify-center -mt-2">
            <div className="w-full max-w-4xl">
              {/* Roll shadow */}
              <div className="h-4 bg-gradient-to-t from-amber-950/60 to-transparent rounded-t-full mx-4" />
              {/* Wooden rod */}
              <div className="h-6 bg-gradient-to-t from-amber-800 via-amber-700 to-amber-900 rounded-full shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
