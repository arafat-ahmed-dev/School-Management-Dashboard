import { MapPin, Clock, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactSection() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold mb-2">
          We&apos;d Love To Hear From You
        </h2>
        <p className="text-muted-foreground">
          We&apos;re happy to help - no matter what stage of wedding planning
          you are at.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Map Section */}
        <Card>
          <CardContent className="p-0">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d270.03460406968446!2d91.93171675422528!3d24.914261174048992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sbd!4v1736438070749!5m2!1sen!2sbd"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
              title="Location map"
            />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-8">
          {/* How to Find Us */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">How to Find Us</h3>
                  <p className="text-muted-foreground">
                    Floor Mill Lane
                    <br />
                    Brighton
                    <br />
                    East Sussex
                    <br />
                    BN1 1AB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* When to Visit */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">When to Visit</h3>
                  <div className="text-muted-foreground space-y-1">
                    <p>Monday to Friday - 9am - 5pm</p>
                    <p>Saturday - 9am - 4pm</p>
                    <p>Sunday - Closed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Get in Touch */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    How to Get in Touch
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    We make sure to respond to every enquiry within 48 hours.
                  </p>
                  <p className="text-muted-foreground">
                    Please call us on{" "}
                    <span className="text-primary">01234 567 890</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
