import React, { useState } from "react";
import { Switch, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation } from "react-router-dom";

interface PricingPlansProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ darkMode, toggleDarkMode }) => {
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const navigate = useNavigate();
  const location = useLocation();

  const plans = [
    {
      name: "Basic Free Plan",
      price: "$0",
      billing: "/month",
      description: "Explore basic features at no cost",
      features: [
        "Basic channel performance insights",
        "10 monthly API credits",
        "1 AI-generated SEO suggestion per month",
        "1-month historical data tracking",
        "No advanced SEO suggestions",
        "No email support",
      ],
      button: "Start for Free",
    },
    {
      name: "Pro Plan",
      price: billingCycle === "Monthly" ? "$15" : "$12",
      billing: "/month",
      description: "For serious creators focused on growth",
      features: [
        "50 monthly API credits",
        "6-month historical data tracking",
        "AI-generated SEO improvement summaries",
        "Enhanced performance tracking",
        "Email support",
        "Track up to 2 channels",
        "Basic performance change notifications",
      ],
      button: "Upgrade to Pro",
    },
    {
      name: "Advanced Plan",
      price: billingCycle === "Monthly" ? "$40" : "$32",
      billing: "/month",
      description: "Advanced tools for intense growth needs",
      features: [
        "200 monthly API credits",
        "Personalized AI-generated SEO insights",
        "1-year historical data tracking",
        "Priority email support",
        "Track up to 5 channels",
        "Real-time notifications and recommendations",
        "Downloadable reports (PDF/Excel)",
      ],
      button: "Get Advanced",
    },
    {
      name: "Enterprise Plan",
      price: "Custom",
      billing: "",
      description: "Custom solution for agencies and large creators",
      features: [
        "Unlimited API credits",
        "Competitor analysis and SEO benchmarking",
        "Unlimited channel tracking",
        "Dedicated account manager",
        "24/7 support",
        "Integration with other platforms",
        "Personalized reviews and strategy calls",
        "Custom report generation",
      ],
      button: "Contact Sales",
    },
  ];

  const handleClose = () => {
    if (location.state?.from === "Dashboard") {
      navigate("/Dashboard");
    } else if (location.state?.from === "ContentCreatorsDashboard") {
      navigate("/ContentCreatorsDashboard");
    } else {
      navigate("/Content-Creators-Dashboard"); 
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-[#0A1739] text-white" : "bg-gray-100 text-black"
      } h-screen transition-colors duration-300 w-full`}
    >
      <div className="absolute bottom-4 left-4">
        <Switch
          checked={darkMode}
          onChange={toggleDarkMode}
          color="default"
          inputProps={{ "aria-label": "dark mode toggle" }}
        />
      </div>

      <div className="absolute top-4 right-4">
        <IconButton onClick={handleClose} color="inherit">
          <CloseIcon />
        </IconButton>
      </div>

      <div className="text-center mb-8 pt-12">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-gray-500">
          Select the plan that best fits your needs. Save up to 20% with annual billing.
        </p>
        <div className="flex justify-center mt-4">
          <button
            className={`px-4 py-2 rounded-l-lg transition-colors duration-300 ${
              billingCycle === "Monthly" ? "bg-[#012244] text-white" : "bg-gray-300 text-gray-700"
            } hover:bg-[#012244]`}
            onClick={() => setBillingCycle("Monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg transition-colors duration-300 ${
              billingCycle === "Annual" ? "bg-[#022340] text-white" : "bg-gray-300 text-gray-700"
            } hover:bg-[#022340]`}
            onClick={() => setBillingCycle("Annual")}
          >
            Annual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-12 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg shadow-md transition-all duration-300 ${
              darkMode ? "bg-[#1A2B3C] text-white" : "bg-white"
            } hover:border-2 hover:border-[#25A906]`}
          >
            <h3 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-black"}`}>
              {plan.name}
            </h3>
            <p className={`text-2xl font-bold mt-2 ${darkMode ? "text-white" : "text-black"}`}>
              {plan.price}
              <span className="text-sm">{plan.billing}</span>
            </p>
            <p className={`text-sm text-gray-500 mt-2 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
              {plan.description}
            </p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className={`text-sm ${darkMode ? "text-white" : "text-gray-700"}`}>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="flex justify-center mt-4">
              <button className="bg-gradient-to-r from-[#D6ED07] to-[#25A906] text-white py-2 px-4 w-full rounded-lg">
                {plan.button}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
