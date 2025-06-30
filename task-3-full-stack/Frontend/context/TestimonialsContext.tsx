// context/TestimonialsContext.tsx
"use client"; // Add this at the top of the file
import React, { createContext, useContext, useEffect, useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  feedback: string;
  stars: number;
  link: string;
}

interface TestimonialsContextType {
  testimonials: Testimonial[];
  fetchTestimonials: () => void;
}

const TestimonialsContext = createContext<TestimonialsContextType | undefined>(undefined);

export const TestimonialsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/ratings");
      const data = await response.json();
      setTestimonials(data.data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <TestimonialsContext.Provider value={{ testimonials, fetchTestimonials }}>
      {children}
    </TestimonialsContext.Provider>
  );
};

export const useTestimonials = () => {
  const context = useContext(TestimonialsContext);
  if (!context) {
    throw new Error("useTestimonials must be used within a TestimonialsProvider");
  }
  return context;
};
