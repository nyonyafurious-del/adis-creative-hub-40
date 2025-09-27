import { Palette, Play, Zap, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const services = [
  {
    icon: Palette,
    title: "Logo Design",
    description: "Professional logos that make your brand unforgettable",
    features: ["3 Concepts", "Unlimited Revisions", "All File Formats", "Copyright Transfer"],
    price: "From $149",
    popular: false
  },
  {
    icon: Play,
    title: "YouTube Thumbnails",
    description: "Eye-catching thumbnails that boost your click-through rates",
    features: ["High CTR Design", "A/B Test Ready", "Mobile Optimized", "24h Delivery"],
    price: "From $49",
    popular: true
  },
  {
    icon: Zap,
    title: "Video Editing",
    description: "Professional video editing that keeps viewers engaged",
    features: ["Color Grading", "Motion Graphics", "Sound Design", "Fast Turnaround"],
    price: "From $299",
    popular: false
  }
]

export function ServicesOverview() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Services That <span className="text-gradient-youtube">Drive Results</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional design services tailored to grow your business and increase conversions.
          </p>
        </div>

        {/* Services carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <CarouselItem key={service.title} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <div 
                      className={`relative card-premium h-full ${service.popular ? 'ring-2 ring-youtube-red' : ''}`}
                    >
                      {service.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                          <span className="bg-gradient-youtube text-white px-4 py-1 rounded-full text-sm font-medium">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-youtube rounded-xl mb-6">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                        <p className="text-muted-foreground mb-6">{service.description}</p>
                        
                        <div className="space-y-3 mb-8">
                          {service.features.map((feature) => (
                            <div key={feature} className="flex items-center justify-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-youtube-red" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-2xl font-bold text-foreground mb-6">{service.price}</div>
                        
                        <Button 
                          className={`w-full font-medium ${
                            service.popular 
                              ? 'bg-gradient-youtube hover:shadow-glow' 
                              : 'variant-outline border-youtube-red text-youtube-red hover:bg-youtube-red hover:text-white'
                          } transition-all duration-300`}
                        >
                          Get Started
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-subtle rounded-2xl">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Need a Custom Package?
          </h3>
          <p className="text-muted-foreground mb-6">
            Let's discuss your project and create a tailored solution that fits your needs and budget.
          </p>
          <Button 
            size="lg"
            className="bg-gradient-youtube hover:shadow-glow transition-all duration-300 font-semibold px-8 py-4"
          >
            Schedule Free Consultation
          </Button>
        </div>
      </div>
    </section>
  )
}