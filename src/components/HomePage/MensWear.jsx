import React from 'react';
import { Link } from 'react-router-dom';

import bandhgalaImg from '../../assets/HomePageWearCollectionImg/men/bandhgala.jpg';
import kurtaSherwaniImg from '../../assets/HomePageWearCollectionImg/men/kurta_sherwani.jpg';
import suitImg from '../../assets/HomePageWearCollectionImg/men/suit.jpg';
import indoWesternImg from '../../assets/HomePageWearCollectionImg/men/indo_western.jpg';


const categories = [
    { name: "Bandhgalas", image: bandhgalaImg, path: "/men/clothing/bandhgalas" },
    { name: "Kurta Pajamas", image: kurtaSherwaniImg, path: "/men/clothing/kurtapajamas" },
    { name: "Suits", image: suitImg, path: "/men/clothing/suits" },
    { name: "Indo-Western", image: indoWesternImg, path: "/men/clothing/indowesterns" },
];


const MenswearCollection = () => {
    return (
        <section className="py-10 px-6 text-center">

            <div className="mb-8">
                <h2 className="text-4xl text-[rgb(120,65,120)]">Menswear Collection</h2>
                <p className="italic text-gray-600 mt-2 mb-6">“Because he deserves to look royal too.”</p>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
                {categories.map((cat, index) => (
                    <Link to={cat.path} key={index} className="w-72 rounded-lg overflow-hidden cursor-pointer
                      transform transition-transform duration-[2000ms] ease-[ease]
                      hover:scale-95">
                        <div className="relative w-full h-80">
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 w-full  p-[12px] mb-[22px] text-center text-[1.1rem] font-semibold text-[rgb(106,74,120)] bg-[rgba(246,246,218,0.866)] uppercase">
                                {cat.name}
                            </div>
                        </div>
                    </Link>
                ))}

            </div>
        </section>
    );
};

export default MenswearCollection;
