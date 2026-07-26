import HistoryContent from "@/components/HistoryContent";
import LikedContent from "@/components/LikedContent";
import React, { Suspense, useEffect, useState } from "react";
const index = () => {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-4xl">
        <Suspense fallback={<div>Loading liked videos...</div>}>
          <LikedContent />
        </Suspense>
      </div>
    </main>
  );
};
export default index;