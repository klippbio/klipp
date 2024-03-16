"use client";
import React from "react";
import Container from "./container";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";

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
                    <ChevronDownIcon
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
    question: "What is klipp?",
    answer:
      "klipp is a platform for creators to monetize content, offering a digital store, scheduling, and more within a link-in-bio setup.",
  },
  {
    question: "Is klipp free to use?",
    answer:
      "Yes, using klipp is free for now, with no setup or subscription fees; you only pay standard transaction fees to Stripe for payment processing.",
  },
  {
    question: "How much can I earn?",
    answer:
      "Your earnings depend on what and how much you sell. There's no limit – the more you sell, the more you earn.",
  },
  {
    question: "What can I sell?",
    answer:
      "You can sell any digital product like courses, ebooks, or offer services like coaching sessions.",
  },
  {
    question: "How do payments work?",
    answer:
      "When you sell something, the money goes through Stripe and then straight to your bank account.",
  },
];

export default Faq;
