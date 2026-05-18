import React from 'react'
import bannerImage from "../../assets/Banner.jpeg";


const RentalBanner = () => {
  return (
    <>

      <div className="px-8 transform transition duration-1000 hover:scale-98 lg:px-16">
        <div className="flex flex-wrap p-7 items-center bg-[#f8f3ee] text-[#3e3e3e] rounded-lg shadow-lg font-poppins sm:mx-8 mt-20 gap-9">

          {/* Left side */}
          <div className='flex flex-col xl:w-lg  '>

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
          <div className="hidden flex-1 sm:flex sm:mx-8 sm:mt-6 lg:px-10">
            <img
              src={bannerImage}
              alt="Fashion Banner"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default RentalBanner


