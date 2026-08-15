'use client';

import React from 'react';
import Image from 'next/image';

export default function DirectorPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Banner Heading */}
      <div className="bg-[#0f2038] text-white text-center py-6 shadow-sm">
        <h1 className="text-3xl md:text-5xl font-black tracking-wider uppercase">
          Director&apos;s Message
        </h1>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
          
          {/* Left Column: Image, Name & Title */}
          <div className="md:col-span-5 flex flex-col items-start space-y-4">
            <div className="w-full relative aspect-[4/3] bg-slate-200 overflow-hidden shadow-sm">
              <Image
                src="/director-photo.png"
                alt="Kel Jordan - Director at Golden Glades Middle"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="pt-2">
              <h2 className="text-2xl md:text-3xl font-light text-slate-900 tracking-wide uppercase">
                KEL JORDAN
              </h2>
              <p className="text-sm text-slate-600 mt-1 font-normal">
                Director at Golden Glades Middle
              </p>
            </div>
          </div>

          {/* Right Column: Letter Text */}
          <div className="md:col-span-7 space-y-5 text-slate-700 text-base leading-relaxed">
            <p>Dear GGM Community,</p>

            <p>
              It is with great excitement and gratitude that I introduce myself as the School Director at Golden Glades Middle. I am truly honored to lead a vibrant and diverse community, where every voice shall be valued and heard and every achievement, big or small, is celebrated.
            </p>

            <p>
              Our school&apos;s motto, <strong className="font-bold text-slate-900">&quot;Where Future Leaders Strive&quot;</strong>, serves as our daily call to action. It is a powerful reminder that education is not just about what we learn in the classrooms but about how we grow, challenge ourselves, and prepare to impact the world around us. Whether through rigorous inquiries in Science and History, creative expression in Drama and Art, or practical skill-building in our Cooking and Gym classes, we are committed to helping every student from 6th to 8th grade and our SPED program to take the next step in their leadership journey.
            </p>

            <p>
              At Golden Glades Middle, I believe in nurturing our students academically, socially, and emotionally. My vision is to build on our strong foundation by fostering a safe, inclusive, and inspiring environment where students are empowered to reach their fullest potential. Together with our dedicated staff and our engaged community, we will continue to cultivate a culture of excellence, curiosity, and kindness.
            </p>

            <p>
              Thank you for being part of our story. Let&apos;s strive for greatness and make this school year our best one.
            </p>

            <div className="pt-4 space-y-2">
              <p>Warmly,</p>
              <p className="font-medium text-slate-900">Mr. Kel Jordan</p>
              {/* Cursive Signature Graphic or Styled Font */}
              <div className="pt-1">
                <span className="font-serif italic text-2xl text-slate-800 tracking-wide">
                  Mr. Kel Jordan
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
