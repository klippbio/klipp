"use client";
import Hero from "../components/hero";
import Navbar from "../components/navbar";
import SectionTitle from "../components/sectionTitle";
import { benefitOne, stepOne, stepThree, stepTwo } from "../components/data";
import Benefits from "../components/benefits";
import Footer from "../components/footer";
import Cta from "../components/cta";
import Faq from "../components/faq";
import Steps from "@/components/steps";
const Home = () => {
  return (
    <div>
      <div className="bg-[url('/img/background2.png')] bg-cover bg-center">
        <Navbar />
        <Hero />
      </div>

      <div className="bg-secondary-foreground">
        <SectionTitle title="No Credit Card Required"></SectionTitle>
      </div>
      <div className="px-14 py-14 bg-gradient-to-b from-violet-50 to-white">
        <Benefits data={benefitOne} />
      </div>
      <div className="bg-white px-14">
        {/* <Creators /> */}

        <Steps imgPos="right" data={stepOne} />
        <Steps imgPos="left" data={stepTwo} />
        <Steps imgPos="right" data={stepThree} />
        {/* <SectionTitle
        pretitle="Watch a video"
        title="Learn how to fullfil your needs"
      >
        This section is to highlight a promo or demo video of your product.
        Analysts says a landing page with video has 3% more conversion rate. So,
        don&apos;t forget to add one. Just like this.
      </SectionTitle> */}
        {/* <Video /> */}
        {/* <SectionTitle
        pretitle="Testimonials"
        title="Here's what our customers said"
      >
        Testimonails is a great way to increase the brand trust and awareness.
        Use this section to highlight your popular customers.
      </SectionTitle>
      <Testimonials /> */}

        <SectionTitle
          pretitle="FAQ"
          title="Frequently Asked Questions"
        ></SectionTitle>
        <Faq />

        <Cta />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
