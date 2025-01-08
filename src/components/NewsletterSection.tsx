export function NewsletterSection() {
  return (
    <section id="newsletter" className="py-12 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Subscribe to our Newsletter</h2>
        <form className="flex flex-col items-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 border border-gray-300 rounded mb-4"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
