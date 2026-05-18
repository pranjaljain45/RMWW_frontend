import React from 'react';
import { Link } from 'react-router-dom';

import lehengaImg from '../../assets/women/lehenga.jpg';
import gownImg from '../../assets/women/gown.jpg';
import sareeImg from '../../assets/women/saree.jpg';
import indoWesternImg from '../../assets/women/indoWestern.jpg';

const categories = [
    { name: 'Gowns', image: gownImg, path: '/women/clothing/gown' },
    { name: 'Lehengas', image: lehengaImg, path: '/women/clothing/lehenga' },
    { name: 'Sarees', image: sareeImg, path: '/women/clothing/saree' },
    { name: 'IndoWestern', image: indoWesternImg, path: '/women/clothing/indowestern' },
];

const WomensWear = () => {
    return (
        <section className="py-10 px-5 text-center">
            <div className="mb-8">
                <h2 className="text-4xl text-[rgb(120,65,120)]">Womenswear Collection</h2>
                <p className="italic text-gray-600 mt-2 mb-6">“Because she deserves to look nothing less than royalty.”</p>
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

export default WomensWear;