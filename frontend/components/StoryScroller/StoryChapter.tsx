"use client";

import React from "react";

interface StoryChapterProps {
  id: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export const StoryChapter: React.FC<StoryChapterProps> = ({
  id,
  className = "",
  children,
}) => {
  return (
    <section
      id={id}
      data-chapter={id}
      className={`story-chapter relative w-full min-h-[120vh] flex flex-col justify-center py-24 sm:py-32 px-6 sm:px-8 ${className}`}
    >
      <div className="max-w-[1340px] w-full mx-auto relative z-10">
        {children}
      </div>
    </section>
  );
};
