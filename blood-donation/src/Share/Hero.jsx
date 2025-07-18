import React from 'react';

const Hero = ({ title = "Donate Your Blood to Us, Save More Life Together",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes.",
  primaryButtonText = "Learn More",
  secondaryButtonText = "Watch Video",
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
  imageUrl = "./../../public/Blood-donation.jpg",
  imageAlt = "Woman donating blood in medical facility",
  showDecorations = true,}) => {
    return (
        <div>
             <section className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Decorative Elements */}
      {showDecorations && (
        <>
          <div className="absolute top-8 left-1/4 w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="absolute top-16 right-1/3 w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="absolute top-32 left-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
        </>
      )}

      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh]">
          {/* Image Section */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={imageAlt}
                className="w-full h-auto rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2 space-y-6">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">{title}</h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">{description}</p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onPrimaryClick}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                {primaryButtonText}
              </button>

              <button
                onClick={onSecondaryClick}
                className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-lg font-semibold border border-gray-200 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <div className="bg-red-600 text-white p-2 rounded-full">
                  {/* <Play size={16} fill="currentColor" /> */}
                </div>
                {secondaryButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
        </div>
    );
};

export default Hero;