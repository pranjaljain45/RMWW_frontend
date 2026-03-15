import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/HomePage/Header'
import Features from '../components/HomePage/Features'
import WomenWear from '../components/HomePage/WomensWear'
import MenWear from '../components/HomePage/MensWear'
import RentalProcess from '../components/HomePage/RentalProcess'
import RentalBanner from '../components/HomePage/Banner'
import Footer from '../components/Footer'

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div>

      {scrolled && <Navbar />}
      <Header />
      <Features />
      <WomenWear />
      <MenWear />
      <RentalProcess />
      <RentalBanner />
      <Footer />

    </div>
  )
}

export default Home
