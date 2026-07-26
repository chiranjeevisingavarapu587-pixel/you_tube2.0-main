"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
const categories = [
  "All",
  "Music",
  "Gaming",
  "Movies",
  "News",
  "Sports",
  "Technology",
  "Comedy",
  "Education",
  "Science",
  "Travel",
  "Food",
  "Fashion",
];
export default function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState("All");
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto bg-white px-2 py-2 dark:bg-black scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "secondary"}
          className="whitespace-nowrap rounded-full px-4 text-sm"
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}