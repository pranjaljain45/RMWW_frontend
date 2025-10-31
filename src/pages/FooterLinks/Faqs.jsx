import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const faqs = [
    {
        question: "What is the rental duration?",
        answer:
            "You can rent each outfit for either 4 or 8 days. The rental period begins from your selected delivery date, not your booking date."
    },
    {
        question: "How do I cancel my order? Will I get a refund?",
        answer: `Yes, but a flat ₹500 cancellation charge will apply to all cancellations.\n
• Cancel >7 days before delivery: 100% rental refund (after ₹500 deduction)\n
• Cancel 3–7 days before delivery: 50% rental refund (after ₹500 deduction)\n
• Cancel <3 days before delivery: No refund\n
Your security deposit is always fully refundable.`
    },
    {
        question: "Is delivery and pickup free?",
        answer:
            "Yes, we provide FREE delivery and pickup PAN India. We make sure your outfit arrives before your event and collect it the next day after the rental ends."
    },
    {
        question: "How do I give my measurements?",
        answer:
            "Once you place your order, we'll email or WhatsApp you a simple measurement form."
    },
    {
        question: "What if the outfit doesn’t fit?",
        answer:
            "We use your provided measurements to custom-fit the outfit. In case of any issue, contact us immediately — we'll try our best to resolve it."
    },
    {
        question: "How do you maintain hygiene?",
        answer:
            "Every outfit is dry-cleaned, steam-ironed, and sanitized before dispatch. Accessories are also disinfected to ensure top hygiene."
    },
    {
        question: "When will I get my security deposit back?",
        answer:
            "Within 7–14 working days after the outfit passes the quality check upon return."
    }
];

const FAQS = () => {


    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
                <h2 className="text-xl font-semibold text-center mb-10">FAQs</h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className=" rounded-md p-4"
                        >
                            <button
                                className="w-full flex justify-between items-center text-left text-lg font-medium bg-none"
                                onClick={() => toggle(index)}
                            >
                                {faq.question}
                                <span className="text-xl">{openIndex === index ? '-' : '+'}</span>
                            </button>

                            {openIndex === index && (
                                <div className="mt-3 text-sm whitespace-pre-line text-gray-700">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default FAQS;
