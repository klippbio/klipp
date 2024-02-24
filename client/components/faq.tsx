"use client";
import React from "react";
import Container from "./container";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

const Faq = () => {
  return (
    <Container className="!p-0">
      <div className="w-full max-w-2xl p-2 mx-auto text-justify rounded-2xl">
        {faqdata.map((item) => (
          <div key={item.question} className="mb-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-100 focus-visible:ring-opacity-75 dark:bg-trueGray-800 dark:text-gray-200">
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-indigo-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-gray-500 dark:text-gray-300">
                    {item.answer}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Container>
  );
};

const faqdata = [
  {
    question: "What is Klipp?",
    answer:
      "Klipp is an all-in-one platform designed for creators who wish to monetize their content and engage with their audience in a more organized and efficient manner. It serves as a link-in-bio digital store, enabling creators to sell digital products, offer personalized links, manage a scheduling calendar, and much more.",
  },
  {
    question: "Is Klipp completely free to use?",
    answer:
      "Yes, Klipp is completely free to use. There are no hidden fees or charges for setting up and operating your Klipp store. The only costs involved are those associated with payment processing, which are handled by Stripe, our payment processing partner. These fees are standard for online transactions and are beyond our control.",
  },
  {
    question: "How much can I earn? ",
    answer:
      "Your earning potential on Klipp is directly influenced by the size, engagement, and loyalty of your audience, as well as the value and pricing of the products or services you offer. There is no upper limit to how much you can earn; it all depends on your strategy, marketing efforts, and the demand for your offerings.",
  },
  {
    question: "What type of products can I sell? ",
    answer:
      "On Klipp, you can sell a wide variety of digital products and services. This includes, but is not limited to, scheduling sessions for consultations or classes, digital products such as ebooks, courses, videos, music, software, and personalized links to exclusive content or communities.",
  },
  {
    question: "How does the payments work? ",
    answer:
      "Payments on Klipp are processed through Stripe Connect, a powerful and secure payment processing platform. When a customer makes a purchase on your Klipp store, the payment is handled by Stripe, which ensures a smooth and secure transaction process. As a seller, you'll need to set up a Stripe account and connect it to your Klipp store. This allows you to receive payments directly into your bank account. ",
  },
];

export default Faq;
