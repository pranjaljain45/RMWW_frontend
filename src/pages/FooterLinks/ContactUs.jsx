import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const ContactUs = () => {
    return (

        <>
            <Navbar />

            <div className='py-12 px-16 pb-0 mx-15'>

                <h2 className="text-2xl font-bold text-center mb-15 text-[#602e74]">WedsWardrobe</h2>

                <div className="bg-white lg:px-[8rem] text-left text-gray-800">

                    <h2 className="text-xl font-bold text-[#602e74] mb-6">Contact Us</h2>

                    <div className="space-y-3 text-lg">
                        <p>
                            <span className="font-semibold">Email: </span>
                            <a href="mailto:care@WedsWardrobe.com" className="hover:underline">
                                care@WedsWardrobe.com
                            </a>
                        </p>

                        <p>
                            <span className="font-semibold">Phone: </span>
                            <a href="tel:+919876543210" className="over:underline">
                                +91‑987‑654‑3210
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ContactUs;
