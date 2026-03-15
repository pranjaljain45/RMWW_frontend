import React from "react";
import bannerImage from "../../assets/Banner.jpeg";

const Banner = () => (
    <div className="px-8 lg:px-16 transform transition duration-3000 hover:scale-98">


        <div className="flex flex-wrap items-center p-6 sm:p-10 mt-20 sm-mx-8 bg-[#f8f3ee] text-[#3e3e3e] justify-around 
                        font-poppins rounded-lg shadow-lg gap-5 flex-row xl:mx-25">


            {/* Left side */}
            <div className='flex flex-col lg:w-md lg:px-20 xl:w-2xl '>

                <h1 className="text-3xl font-semibold text-[#55326a] md:text-2xl sm:text-xl lg:text-4xl">
                    Rent it. Style it.
                </h1>

                <h1 className="text-3xl font-semibold text-[#55326a] md:text-2xl sm:text-xl lg:text-4xl">
                    Rent it. Earn it.
                </h1>

                <div className="mt-8">
                    <h2 className="text-xl text-[#4b2d1a] mb-2 md:text-lg">Contact Us</h2>
                    <p className="text-base text-[#333]">
                        Email: <a href="mailto:care@rentmyweddingwear.com" className="text-[#7a4d36] hover:underline">care@rentmyweddingwear.com</a>
                    </p>
                    <p className="text-base text-[#333]">Phone: +91-987-654-3210</p>
                </div>
            </div>

            {/* Right side: Image */}
            <div className="hidden flex-1 md:flex justify-center items-center mt-8 md:mt-6 lg:px-10">
                <img
                    src={bannerImage}
                    alt="Fashion Banner"
                    className="w-full max-w-md h-64 object-cover rounded-lg shadow-md"
                />
            </div>
        </div>
    </div>
);

export default Banner;
