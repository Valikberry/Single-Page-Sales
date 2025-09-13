"use client";

import { useState } from "react";

interface FAQProps {
  isProduct?: boolean;
}

export default function FAQ({ isProduct = false }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "What is SponsoredJobsAlert.com?",
      answer:
        "SponsoredJobsAlert.com is a free community platform that helps job seekers discover visa-sponsored job opportunities in countries like the UK, USA, Canada, and more. We share real-time alerts via WhatsApp and Telegram.",
    },
    {
      question: "Is this a job agency or recruiter?",
      answer:
        "No. We are not a recruitment agency. We curate and forward job listings from public sources to our members through messaging apps. We do not represent employers or handle applications.",
    },
    {
      question: "How does it work?",
      answer:
        "It's simple: Visit the Home Page, choose your target country, join the relevant WhatsApp or Telegram group, get free job alerts as soon as they are posted, and apply early to increase your chances of success.",
    },
    {
      question: "Is it really free?",
      answer:
        "Yes — completely free. We do not charge for joining our communities or receiving job alerts",
    },
    {
      question: "Do you guarantee a job or visa?",
      answer:
        "No. We share leads to verified visa-sponsored jobs, but we cannot guarantee hiring outcomes. The hiring decision and visa process are handled entirely by the employers.",
    },
    {
      question: "How do I join a group?",
      answer:
        "Just click on the group link provided under each job category on our website. You can join via WhatsApp or Telegram, depending on your preference.",
    },
    {
      question: "Are the job listings verified?",
      answer:
        "We strive to share listings from trusted public sources, but we encourage all members to do their own research and avoid suspicious offers. We do not have control over third-party links or employer responses.",
    },
    {
      question: "Do you collect or store my data?",
      answer:
        "No. We do not collect, store, or process personal data. All activity happens inside WhatsApp and Telegram. We rely on those platforms' built-in security and privacy policies.",
    },
    {
      question: "Can I leave the group anytime?",
      answer:
        "Absolutely. You are free to leave, mute, or block at any time—no questions asked.",
    },
    {
      question: "How can I get support?",
      answer:
        "For any questions or help: Email us at contact@sponsoredjobsalert.com, or message us via WhatsApp Support.",
    },
  ];

  const productFaqData = [
    {
      question: "What am I purchasing exactly?",
      answer:
        "You're purchasing access to premium resources including editable job application templates, step-by-step guides, and 1-on-1 visa-sponsored job consultation via Google Meet, WhatsApp chat, or email. You'll also receive early access to new job offers posted on our platform.",
    },
    {
      question: "How is the consultation done?",
      answer:
        "Consultations are conducted through Google Meet, WhatsApp, or email—whichever works best for you. After purchase, you'll receive an email to schedule your session or start a chat.",
    },
    {
      question: "What if I don't get a job after purchasing the premium offer?",
      answer:
        "We do not guarantee job placement or visas. However, all paid customers are placed on priority dial, meaning you get notified first as soon as suitable offers are posted. Our team continues to support you with guidance and relevant leads even after the consultation.",
    },
    {
      question: "Are refunds available?",
      answer:
        "No, we do not offer refunds. Our services include access to digital templates, private resources, and time-based consultations which are non-returnable.",
    },
    {
      question: "How do I access the editable templates and guides?",
      answer:
        "Once payment is confirmed, you'll receive a link via email to access and download your editable files (Google Docs or PDF format).",
    },
    {
      question: "Can I contact support if I have issues?",
      answer:
        "Yes! You can contact us via WhatsApp, email, or the support section on our website.",
    },
    {
      question: "How long do I have access to the materials?",
      answer:
        "You'll have lifetime access to the templates and guides you download.",
    },
    {
      question: "Can I share the templates with others?",
      answer:
        "No. All digital resources are licensed for individual use only. Redistribution is not allowed.",
    },
    {
      question: "Is my payment secure?",
      answer:
        "Yes, all transactions are processed securely through our trusted payment gateway.",
    },
    {
      question: "Will I be charged monthly?",
      answer:
        "No, this is a one-time payment unless stated otherwise on the product page.",
    },
  ];

  // Use product FAQ data if isProduct is true, otherwise use general FAQ data
  const currentFaqData = isProduct ? productFaqData : faqData;

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-4 py-6 flex-grow">
      <div className="container mx-auto max-w-md px-4">
        <div className="divide-y divide-gray-300">
          {currentFaqData.map((item, index) => (
            <div
              key={index}
              className="py-3 cursor-pointer"
              onClick={() => toggleIndex(index)}
            >
              <h3 className="font-semibold text-gray-900 flex justify-between items-center">
                {item.question}
                <span className="ml-2 text-gray-500">
                  {openIndex === index ? "−" : "+"}
                </span>
              </h3>
              {openIndex === index && (
                <p className="text-gray-700 text-base mt-2">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
