"use client";

import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import CountdownBanner from "@/components/CountdownBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import WhyChooseUs from "@/components/WhyChooseUs";
import PickupBanner from "@/components/PickupBanner";
import ContactMapSection from "@/components/ContactMapSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      <HeroSection />
      <TrustBar />
      <CountdownBanner />
      <FeaturedProducts />
      <Categories />
      <WhyChooseUs />
      <PickupBanner />
      <ContactMapSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
