import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const AboutWedsWardrobe = () => {
    return (
        <>

            <Navbar />

            <div className="px-2 py-12 sm:px-5 mx-[5rem] bg-white text-gray-800 lg:mx-[15rem] lg:px-16 space-y-4">

                {/* About Section */}
                <section className="text-sm  space-y-5 mb-[5rem]">
                    <h2 className="text-xl font-bold text-center text-[#602e74]">ABOUT WedsWardrobe</h2>

                    <div className="italic space-y-3">
                        <p className="leading-relaxed text-center">
                            Step into a wardrobe where dreams dress up <br />
                            For every ritual, every moment, every closeup.
                        </p>
                        <p className="leading-relaxed text-center">
                            No more repeating that same-old sherwani or saree, <br />
                            We bring you looks that dazzle — elegant, bold, and starry.
                        </p>
                        <p className="leading-relaxed text-center">
                            Why buy for a day and then hide it away? <br />
                            We make sure your fashion lives on — every hour, every sway.
                        </p>
                        <p className="leading-relaxed text-center">
                            From haldi hues to sangeet sparkles, from mandap to mehendi mood, <br />
                            WedsWardrobe has curated couture that’s <em>too good to be viewed as used.</em>
                        </p>
                        <p className="leading-relaxed text-center">
                            She’s the bridal blush, he’s the best man glow, <br />
                            You’re the vibe, and we make your style flow.
                        </p>
                        <p className="leading-relaxed text-center">
                            So whether it’s regal, romantic, or red carpet ready, <br />
                            Just swipe, select, and slay — we’ve made renting that steady.
                        </p>
                        <p className="font-semibold text-center text-[#602e74]">
                            We are WedsWardrobe — where wedding dreams dress well.
                        </p>
                    </div>
                </section>

                {/* The Edge */}
                <section className="text-sm">
                    <h2 className="text-base font-bold text-[#602e74]">THE WedsWardrobe EDGE</h2>
                    <p className="leading-relaxed">
                        WedsWardrobe is your one-stop destination for luxurious ethnic fashion on rent — because your big moments deserve more than off-the-rack repetition.
                    </p>
                    <p className="leading-relaxed">
                        Why spend thousands on a bridal lehenga you’ll wear once? Why let your groom's look gather dust in the closet?
                        <br />We’re here to flip the script.
                    </p>
                    <p className="leading-relaxed">
                        Our curated collection features everything from handpicked designer lehengas and ornate sherwanis to dreamy gowns, Indo-western drapes, and statement accessories — all available at just a fraction of the price.
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Free delivery & pickup</li>
                        <li>Free trial sessions</li>
                        <li>High hygiene standards and dry-cleaned perfection</li>
                    </ul>
                    <p className="leading-relaxed">
                        Try on your look in-store or order it online — because luxury should come without limits or logistics.
                    </p>
                </section>

                {/* Story */}
                <section className="text-sm">
                    <h2 className="text-base font-bold text-[#602e74]">THE WedsWardrobe STORY</h2>
                    <p className="leading-relaxed">
                        Founded with love by wedding enthusiasts and fashion-forward hearts, <strong>WedsWardrobe</strong> began with a simple thought — <em>Why should the most special day be the least sustainable?</em>
                    </p>
                    <p className="leading-relaxed">
                        We're the bridesmaids who’ve struggled to find the perfect pastel, the brothers who’ve had last-minute outfit crises, the fashionistas who dream big but spend smart. And now, we’re turning the tide for all.
                    </p>
                    <p className="leading-relaxed">
                        Every piece on our platform is thoughtfully selected, lovingly cared for, and designed to shine again and again — through your stories.
                    </p>
                </section>

                {/* Journey */}
                <section>
                    <h2 className="text-base font-bold text-[#602e74]">THE JOURNEY:</h2>
                    <p className="text-sm leading-relaxed">
                        From soft launches to stunning makeovers, WedsWardrobe has grown from an idea into a movement — dressing hundreds of weddings with effortless style and elegance.
                    </p>
                    <p className="text-sm leading-relaxed">
                        And we’re only getting started.
                    </p>
                    <p className="text-sm leading-relaxed">
                        With a growing range that’s refreshed monthly and exclusive collections under our own label, <strong>WedsWardrobe Signature</strong>, we are here to redefine Indian occasion-wear — trend by trend, celebration by celebration.
                    </p>
                </section>

                {/* Outro */}
                <section className="text-left text-sm">
                    <p className="italic">With love,</p>
                    <p className="font-semibold">From the outfit that’s about to make your big day even bigger.</p>
                    <p className="font-bold mt-4 text-[#602e74]">xoxo, <br /> The WedsWardrobe Team</p>
                </section>
            </div>


            <Footer />

        </>
    );
};

export default AboutWedsWardrobe;

