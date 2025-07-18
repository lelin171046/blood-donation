import { Button } from '@/components/ui/button';
import React from 'react';

const Newslatter = () => {
    return (
        <div>
             <section className="bg-red-600 text-white py-10 px-6 rounded-md">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Text */}
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold mb-2">Join To Get Our Newsletter</h2>
          <p className="text-sm lg:max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
          </p>
        </div>

        {/* Input & Button */}
        <div className="flex items-center w-full max-w-md">
          <div className="relative flex-grow">
            <input
              type="email"
              placeholder="Your Email Address"
              className="w-full px-4 py-3 bg-amber-50 rounded-l-md text-gray-800 focus:outline-none"
            />
            {/* <FaRegEnvelop className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
          </div>
          <button className="bg-black text-white font-semibold px-6 py-3 rounded-r-md hover:bg-gray-900 transition">
            Subscribe
          </button>
          <Button className={"bg-red-600 text-white"} variant={"outline"}>TEszt</Button>
        </div>
      </div>
    </section>
        </div>
    );
};

export default Newslatter;