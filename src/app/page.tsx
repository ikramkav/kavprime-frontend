import React from "react";
import { Box } from "@mui/material";
import LandingNavbar from "@/components/landingPage/Navbar";
import HeroSection from "@/components/landingPage/HeroSection";
import FeaturesSection from "@/components/landingPage/FeaturesSection";
import HowItWorksSection from "@/components/landingPage/HowItWorksSection";
import CTASection from "@/components/landingPage/CTASection";
import Footer from "@/components/landingPage/Footer";

export default function LandingPage() {
  return (
    <Box>
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </Box>
  );
}

