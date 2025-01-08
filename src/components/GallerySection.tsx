import React from "react";

export const GallerySection: React.FC = () => {
  return (
    <section className="gallery bg-gray-100 p-8">
      <h2 className="text-2xl">Gallery</h2>
      <div className="mt-4">
        <img src="/images/school1.jpg" alt="School" className="w-full h-auto" />
        <img src="/images/school2.jpg" alt="School" className="w-full h-auto mt-4" />
      </div>
    </section>
  );
};
