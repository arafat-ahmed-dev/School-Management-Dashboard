import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const FAQSection = ({ isDarkMode, loading }: { isDarkMode: boolean; loading: boolean }) => {
  return (
    <section
      className={`w-full py-12 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="px-4 md:px-6">
        <h2 className={`text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 ${isDarkMode ? "text-white" : "text-black"}`}>
          Frequently Asked Questions
        </h2>
        {loading ? ( // Conditional rendering for skeleton
          <div className={`skeleton-faq ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}>
            <div className="skeleton-item"></div>
            <div className="skeleton-item"></div>
            <div className="skeleton-item"></div>
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-5xl mx-auto"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>
                What is the student-to-teacher ratio?
              </AccordionTrigger>
              <AccordionContent>
                Our average student-to-teacher ratio is 15:1, ensuring
                personalized attention for each student.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Do you offer financial aid?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer various financial aid options and scholarships based
                on merit and need. Please contact our admissions office for more
                information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                What extracurricular activities are available?
              </AccordionTrigger>
              <AccordionContent>
                We offer a wide range of extracurricular activities including
                sports, arts, music, debate club, robotics, and community service
                opportunities.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
