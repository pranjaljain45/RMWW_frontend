import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const TermsAndConditions = () => {
    return (
        <>

            <Navbar />

            <div className="p-8 max-w-5xl mx-auto mt-10 ">
                <h1 className="text-2xl font-bold mb-6 text-center ">Terms & Conditions</h1>

                <div className="space-y-6 text-gray-800 text-base leading-7">
                    <section>
                        <h2 className="font-semibold ">1. General</h2>
                        <p>
                            These Terms govern your use of the website, including browsing, renting outfits and accessories,
                            and interacting with our content. WedsWardrobe reserves the right to modify or terminate any
                            service at any time without prior notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold ">2. Eligibility</h2>
                        <p>
                            You must be at least 18 years old to use our services. By using this website, you represent that
                            you have the legal capacity to enter into this agreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold ">3. Orders & Payments</h2>
                        <p>
                            All rental orders for outfits and accessories must be placed through the website and are subject
                            to availability. Payments must be made in full before items are shipped. Refunds will be processed
                            after deducting ₹500 as service and handling charges.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold ">4. Cancellation & Refund</h2>
                        <p>
                            Cancellations made 4 days before the delivery date are eligible for a refund (after dedcution of certain amount
                            mention in the faqs section). No
                            refund will be issued for cancellations made within 3 days of delivery.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold ">5. Usage of Rented Outfits & Accessories</h2>
                        <p>
                            All rented items must be returned in the same condition as delivered. Damaged, stained, or
                            unreturned items may result in additional charges.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold ">6. Delivery & Returns</h2>
                        <p>
                            Delivery timelines will be communicated via email or phone. Outfits and accessories must be
                            returned on or before the due date using our return packaging.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold ">7. Privacy Policy</h2>
                        <p>
                            Your use of our services is also governed by our Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold ">8. Contact Information</h2>
                        <p>
                            For any queries, please contact us at: <br />
                            <span className="block mt-2">Email: <a href="mailto:care@WedsWardrobe.com" >care@WedsWardrobe.com</a></span>
                            <span> Phone: <a href="tel:+919876543210">+91-987-654-3210</a></span>
                        </p>
                    </section>
                </div>
            </div>

            <Footer />

        </>
    );
};

export default TermsAndConditions;
