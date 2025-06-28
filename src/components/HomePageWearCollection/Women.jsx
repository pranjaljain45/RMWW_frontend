import React from 'react';
import { Link } from "react-router-dom";
import './Women.css';

import lehengaImg from '../../assets/HomePageWearCollectionImg/women/lehenga.jpg';
import gownImg from '../../assets/HomePageWearCollectionImg/women/gown.jpg';
import sareeImg from '../../assets/HomePageWearCollectionImg/women/saree.jpg';
import indoWesternImg from '../../assets/HomePageWearCollectionImg/women/indo_western.jpg';


const categories = [
    { name: "gowns", image: gownImg, path: "/women/dresses/gowns" },
    { name: "lehengas", image: lehengaImg, path: "/women/dresses/lehengas" },
    { name: "sarees", image: sareeImg, path: "/women/dresses/sarees-blouses" },
    { name: "Indo-Western", image: indoWesternImg, path: "/women/dresses/indo-western" },
];


const WomenwearCollection = () => {
    return (
        <section className="womenswear-section">

            <div className="heading-area">
                <h2>Womenswear Collection</h2>
                <p className="quote">“Because she deserves to look nothing less than royalty.”</p>
            </div>

            <div className="womenswear-cards">
                {categories.map((cat, index) => (
                    <Link to={cat.path} key={index} className="womenswear-card">
                        <div className="image-container">
                            <img src={cat.image} alt={cat.name} />
                            <div className="overlay-text">{cat.name}</div>
                        </div>
                    </Link>
                ))}

            </div>
        </section>
    )
};

export default WomenwearCollection;




