import React from "react";
import { HeartHandshake, Shield, Truck } from "lucide-react";

const FeaturesSection = () => {
  return <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Authenticity Guaranteed
          </h3>
          <p className="text-gray-600">
            Every item is verified by our expert team for complete
            authenticity.
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Free Luxury Delivery
          </h3>
          <p className="text-gray-600">
            Complimentary white-glove delivery service for all orders over
            $500.
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <HeartHandshake className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Concierge Service</h3>
          <p className="text-gray-600">
            Personal shopping assistance from our luxury fashion experts.
          </p>
        </div>
      </div>
    </div>
  </section>;
};
export default FeaturesSection;
