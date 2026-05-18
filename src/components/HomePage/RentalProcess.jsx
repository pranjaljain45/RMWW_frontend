import React from 'react';
import rentalBannerImg from '../../assets/RentalBanner.jpg';

const RentalProcess = () => {
    return (
        <div className="px-8 transform transition duration-3000 hover:scale-98 lg:px-16">

            <div className="flex p-7 items-center bg-[#f8f3ee] text-[#3e3e3e] rounded-lg shadow-lg font-poppins sm:mx-8 mt-20">
                {/* Left side: Steps */}

                <div className='flex flex-col lg:w-md xl:w-2xl'>

                    <div className="flex justify-center gap-3 pb-5 ">
                        <h2 className="text-2xl sm:text-4xl font-bold text-[#55326a] m-0">RENTAL</h2>
                        <p className="text-2xl sm:text-4xl font-semibold text-[#6c4c3f] m-0">Process</p>
                    </div>

                    <div className="flex flex-col gap-4 flex-[0.7] sm:w-md lg:w-sm xl:px-10 xl:w-xl" >
                        {[
                            'Bookings via website only.',
                            'Doorstep delivery and pickup.',
                            'Rentals at 1/10th of the M.R.P.',
                            'Look picture perfect & return.'
                        ].map((text, index) => (
                            <div key={index} className="flex items-center bg-white p-3 rounded-md shadow">
                                <div className="bg-[#e4d7ce] text-[#3e3e3e] font-bold rounded-full w-8 h-8 text-center leading-8 mr-3 text-sm">
                                    {index + 1}
                                </div>
                                <div className="text-sm font-medium">{text}</div>
                            </div>
                        ))}
                    </div>

                </div>


                {/* Right side: Image */}

                <div>
                    <img
                        src={rentalBannerImg}
                        alt="Rental Couple"
                        className=" w-85 h-85 object-cover rounded-xl hidden lg:block "
                    />
                </div>

            </div>
        </div>
    );
};

export default RentalProcess;