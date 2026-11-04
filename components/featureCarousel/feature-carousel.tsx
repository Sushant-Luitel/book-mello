"use client";

import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import type { StoreBook } from "@/lib/book-shape";
import { BookCard } from "../books/book-card";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";

interface BookCarouselProps {
  books: StoreBook[];
  options?: EmblaOptionsType;
}
export default function BookCarousel({ books, options }: BookCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options,[
    Autoplay({
        delay:3000,
        stopOnInteraction:false,
        stopOnMouseEnter:true
    })
  ]);
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  return (
    <div className="carousel-wrapper relative">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {books.map((book) => (
            <div className="embla__slide" key={book.id}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center gap-3 mt-8">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-10 w-10 border-border shadow-sm hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors"
          onClick={scrollPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-10 w-10 border-border shadow-sm hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors"
          onClick={scrollNext}
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
