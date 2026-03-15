import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    const handleRedirect = (path) => navigate(path);

    return (
        <footer className="text-black flex flex-col mt-15 mx-10 rounded-lg cursor-pointer lg:justify-center lg:items-center lg:mt-10">
            {/* About Section */}
            <div className="max-w-7xl mx-auto py-12 md:py-8 md:mx-4 lg:w-auto lg:text-5xl">
                <h2 className="text-lg font-bold uppercase mb-6 text-left">ABOUT WedsWardrobe</h2>
                {[
                    "WedsWardrobe IS YOUR ONE-STOP DESTINATION FOR PREMIUM WEDDING AND OCCASION WEAR ON RENT. WE BELIEVE THAT EVERYONE DESERVES TO SHINE ON THEIR SPECIAL DAY WITHOUT THE BURDEN OF HIGH COSTS OR WARDROBE CLUTTER.",
                    "OUR CAREFULLY CURATED COLLECTION FEATURES A WIDE RANGE OF ELEGANT, TRENDY, AND HIGH-QUALITY OUTFITS FOR BRIDES, GROOMS, AND GUESTS ALIKE. WHETHER YOU'RE ATTENDING A WEDDING, ENGAGEMENT, OR FESTIVE CELEBRATION — WE MAKE DESIGNER FASHION ACCESSIBLE, EFFORTLESS, AND AFFORDABLE.",
                    "BEYOND FASHION, WE CARE DEEPLY ABOUT THE ENVIRONMENT. BY CHOOSING TO RENT INSTEAD OF BUY, YOU CONTRIBUTE TO A MORE SUSTAINABLE FUTURE BY REDUCING TEXTILE WASTE AND MINIMIZING THE IMPACT OF FAST FASHION.",
                    "AT WedsWardrobe, WE ARE MORE THAN JUST A RENTAL PLATFORM — WE ARE YOUR STYLE PARTNER. LET US HELP YOU LOOK YOUR BEST, FEEL CONFIDENT, AND CREATE MEMORIES IN OUTFITS THAT SPEAK ELEGANCE AND RESPONSIBILITY."
                ].map((text, i) => (
                    <p key={i} className="text-sm leading-relaxed mb-5 text-left">
                        {text}
                    </p>
                ))}
            </div>

            <div className="container mx-auto max-w-7xl flex flex-wrap justify-between bg-neutral-100 rounded-md p-8">

                <div className="flex-1 min-w-[200px] mb-6">
                    <h3 className="text-md font-bold mb-2">OUR COMPANY</h3>
                    <p className="text-sm mb-1 hover:underline" onClick={() => handleRedirect('/OurProfile')}>OUR PROFILE</p>
                    <p className="text-sm mb-1 hover:underline" onClick={() => handleRedirect('/TnC')}>TERMS AND CONDITIONS</p>
                    <p className="text-sm hover:underline" onClick={() => handleRedirect('/ContactUs')}>CONTACT US</p>
                </div>

                {/* Customer Care */}
                <div className="footer-column flex-1 min-w-[200px] mb-6">
                    <h3 className="text-md font-bold mb-2">CUSTOMER CARE</h3>
                    <p className="text-sm mb-1 hover:underline" onClick={() => handleRedirect('/Faqs')}>FAQs</p>
                    <p className="text-sm hover:underline" onClick={() => handleRedirect('/PrivacyPolicies')}>PRIVACY POLICY</p>
                </div>

                {/* Contact Us */}
                <div className="footer-column flex-1 min-w-[200px] mb-6">
                    <h3 className="text-md font-bold mb-2">CONTACT US</h3>
                    <a href="mailto:care@rentmyweddingwear.com" className="text-sm hover:underline block">care@WedsWardrobe.com</a>
                    <p className="text-sm mt-1">+91‑987‑654‑3210</p>
                </div>


                {/* Careers */}
                <div className="footer-column flex-1 min-w-[200px] mb-6 ">
                    <h3 className="text-md font-bold mb-2">COLLABORATE WITH US</h3>
                    <p className="text-sm mb-1">DROP YOUR ENQUIRIES AT</p>
                    <a href="mailto:careers@rentmyweddingwear.com" className="text-md hover:underline block">
                        careers@WedsWardrobe.com
                    </a>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="text-center py-4 text-gray-500 text-sm mt-6">
                © 2025WedsWardrobe.. All Rights Reserved. WE LOVE TO DRESS YOU UP!
            </div>
        </footer>
    );
};



export default Footer;
