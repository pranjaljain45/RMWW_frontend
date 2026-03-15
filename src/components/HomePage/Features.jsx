import React from 'react';

import { FiTruck, FiRefreshCw } from 'react-icons/fi';
import { MdVerifiedUser } from 'react-icons/md';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { BsCashStack } from 'react-icons/bs';
import { FaHome } from 'react-icons/fa';

const features = [
    { icon: <MdOutlineLocalShipping className="text-3xl text-gray-600" />, title: 'Pan India Delivery' },
    // { icon: <BsCashStack className="text-3xl text-gray-600" />, title: 'COD (Partial Advance)' },
    // { icon: <FaHome className="text-3xl text-gray-600" />, title: 'Try at Home', subtext: 'Check the fit at delivery. Return if it doesn’t suit.' },
    { icon: <FiRefreshCw className="text-3xl text-gray-600" />, title: 'Easy Returns' },
    { icon: <FiTruck className="text-3xl text-gray-600" />, title: 'We ship both ways' },
    { icon: <MdVerifiedUser className="text-3xl text-gray-600" />, title: 'Quality Check & Hygiene' },
];

const Features = () => {
    return (
        <div className="grid grid-cols-2 mt-5 px-0 py-4 gap-3 sm:flex sm:flex-wrap justify-around ml-[3rem] mr-[3rem] lg:mt-[4rem]">
            {features.map((feature, index) => (
                <div key={index} className=" flex flex-col items-center text-center ">
                    <div className="text-xl xl:text-3xl text-gray-600">{feature.icon}</div>
                    <div className="text-sm xl:text-xl text-gray-600">{feature.title}</div>
                    {feature.subtext && (
                        <div className="text-gray-500 text-sm max-w-[150px] break-words">
                            {feature.subtext}
                        </div>
                    )}
                </div>
            ))
            }
        </div >
    );
};

export default Features;
