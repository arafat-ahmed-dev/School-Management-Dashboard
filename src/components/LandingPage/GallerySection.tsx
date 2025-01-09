import Image from "next/image";

const GallerySection = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
<section id="gallery" className={`w-full py-12 md:py-24 lg:py-32 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          School Gallery
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Image
            src="/placeholder.svg?height=300&width=400"
            width={400}
            height={300}
            alt="School campus"
            className="rounded-lg object-cover"
          />
          <Image
            src="/placeholder.svg?height=300&width=400"
            width={400}
            height={300}
            alt="Students in classroom"
            className="rounded-lg object-cover"
          />
          <Image
            src="/placeholder.svg?height=300&width=400"
            width={400}
            height={300}
            alt="Science lab"
            className="rounded-lg object-cover"
          />
          <Image
            src="/placeholder.svg?height=300&width=400"
            width={400}
            height={300}
            alt="Sports field"
            className="rounded-lg object-cover"
          />
          <Image
            src="/placeholder.svg?height=300&width=400"
            width={400}
            height={300}
            alt="Library"
            className="rounded-lg object-cover"
          />
          <Image
            src="/placeholder.svg?height=300&width=400"
            width={400}
            height={300}
            alt="Art studio"
            className="rounded-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
