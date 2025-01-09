import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const FAQSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
<section className={`w-full py-12 md:py-24 lg:py-32 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is the student-to-teacher ratio?</AccordionTrigger>
            <AccordionContent>
              Our average student-to-teacher ratio is 15:1, ensuring personalized attention for each student.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Do you offer financial aid?</AccordionTrigger>
            <AccordionContent>
              Yes, we offer various financial aid options and scholarships based on merit and need. Please contact our admissions office for more information.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>What extracurricular activities are available?</AccordionTrigger>
            <AccordionContent>
              We offer a wide range of extracurricular activities including sports, arts, music, debate club, robotics, and community service opportunities.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
