"use client";
import { motion } from "framer-motion";
import { ImagesSlider } from "../ui/images-slider";

const GallerySection = ({ isDarkMode, loading }: { isDarkMode: boolean; loading: boolean }) => {
  const images = [
    "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  return (
    <section
      id="gallery"
      className={`w-full py-12 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="px-4 md:px-6">
        {loading ? ( // Conditional rendering for skeleton
        <>
         <div className="skeleton-title w-3/4 h-8 bg-gray-400 mb-4 mx-auto"></div>
          <div className={`skeleton-gallery ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}>
            <div className="skeleton-image"></div>
            <div className="skeleton-image"></div>
            <div className="skeleton-image"></div>
          </div>
        </>
        ) : (
          <>
        <h2 className={`text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 ${isDarkMode ? "text-white" : "text-black"}`}>
          School Gallery
        </h2>
          <div className="w-full h-full items-center flex justify-center">
            <ImagesSlider className="h-[30rem] md:w-[80%] w-full md:h-[35rem]" images={images}>
              <motion.div
                initial={{
                  opacity: 0,
                  y: -80,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
                className="z-50 flex flex-col justify-center items-center"
              ></motion.div>
            </ImagesSlider>
          </div>
          </>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
