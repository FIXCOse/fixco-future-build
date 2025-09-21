import Navigation from "@/components/Navigation";

const SimpleHome = () => {
  console.log("Simple Home rendering without i18n");
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            Welcome to <span className="text-primary">Fixco</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Professional services for your home and property
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 py-4 rounded-lg">
              Get Free Quote
            </button>
            <button className="border border-border hover:bg-accent font-bold text-lg px-8 py-4 rounded-lg">
              Call: 08-123 456 78
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleHome;