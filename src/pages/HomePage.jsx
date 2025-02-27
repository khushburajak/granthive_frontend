import React, { lazy, Suspense, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import useAuth from "../hooks/useAuth";

//icons
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot, FaFacebook, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";

//Import Required Components
const Sidebar = lazy(() => import("../components/Common/defaultSidebar"));


function HomePage() {
  const { authState: { token, role } } = useAuth();
  const cardData = [
    { front: "College Info", back: "Get to know the institution you applied for.", image: "/images/CollegeInfo.png" },
    { front: "Filter Search", back: "Search according to your needs on location, courses and more.", image: "/images/FilterSearch.png" },
    { front: "Quick Apply", back: "Apply instantly with a click of a button after creating a profile.", image: "/images/QuickApply.png" },
  ];

  const partners = [
    { name: "Wisdom Technologies", logo: "/images/wt.png" },
    { name: "Partner 2", logo: "/images/wt.png" },
    { name: "Partner 3", logo: "/images/wt.png" },
    { name: "Partner 4", logo: "/images/wt.png" },
  ]

  //Section Title Component
  const SectionTitle = ({ title }) => (
    <div className="flex items-center justify-center w-full my-6 h-fit">
      <div className="flex-grow border-t-4 border-button dark:border-button-dark"></div>
      <span className="bg-button dark:bg-button-dark text-white px-12 md:px-24 lg:px-36 py-1 rounded-full text-sm font-semibold">
        {title}
      </span>
      <div className="flex-grow border-t-4 border-button dark:border-button-dark"></div>
    </div>
  );

  // Memoizing the partners array (if you have a more complex filtering logic, apply it here)
  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => partner);  // Your filtering logic goes here
  }, [partners]);

  const [isFlipped, setFlipped] = useState(Array(cardData.length).fill(false));

  const handleFlip = (index) => {
    const newFlipStates = [...isFlipped];
    newFlipStates[index] = !newFlipStates[index];
    setFlipped(newFlipStates);
  };

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);


  return (
    <div className="h-screen overflow-y-scroll scroll-smooth snap-y bg-background-500 dark:bg-background-dark dark:text-white">
      <Suspense fallback={<div>Loading...</div>}>
        <Sidebar />
      </Suspense>

      {/* Section 1: Landing Image and Introductory Text */}
      <section className="md:h-screen snap-center flex flex-col md:flex-row">
        {/* Image Block: Represents the visual appeal of the landing page */}
        <div className="h-1/2 md:h-full w-full md:w-1/2">
          <img
            src="/images/scholarship.png"
            alt="Landing Image"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Text Block: Provides introductory information with call-to-action */}
        <div className="h-1/2 md:h-full w-full md:w-1/2 flex flex-col justify-center items-center bg-button dark:bg-button-dark px-6 md:px-20 py-6 md:py-20">
          <div className="text-wrap text-2xl md:text-5xl text-center mb-6 md:mb-9">
            Find and apply to get closer to your dreams.
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="w-full break-words md:w-80 text-center text-base md:text-lg mb-4">
              Find scholarships that match your goals and unlock your educational future.
            </div>
            <Link
              to="/institutesearch"
              className="flex items-center justify-center bg-white dark:bg-background-dark text-black dark:text-white h-12 w-3/4 md:w-60 hover:shadow-btn transition font-semibold hover:bg-button dark:hover:bg-button-dark hover:text-white hover:border"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Our Partners */}
      <section id="explore" className="snap-center flex flex-col">
        <SectionTitle title="Our Partners" />

        {/* Container for Partner Logos */}
        <div className="w-full flex justify-between px-6 md:px-32 mb-6 flex-wrap justify-center gap-6">
          {filteredPartners.map((partner, index) => (
            <div key={index} className="flex flex-col items-center w-32 md:w-40 lg:w-48">
              {/* Partner Logo */}
              <div className="rounded-full bg-slate-300 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                  loading="lazy"
                />
              </div>
              {/* Partner Name */}
              <div className="flex items-center justify-center text-center break-words whitespace-normal">{partner.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Create Profile and Stay Notified */}
      <SectionTitle title="Get Notified" />
      <section className="snap-center flex flex-col md:flex-row items-center justify-center px-6 py-16 mx-auto">
        {/* Left Content: Explanation and call to action for profile creation */}
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Create Profile to get Notified of matching scholarships
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-100 mb-6">
            Simply fill in your details, and we'll notify you about scholarships that match your qualifications and goals. Stay updated and never miss an opportunity!
          </p>
          <Link
            to="/signup"
            className="flex items-center justify-center text-center bg-button dark:bg-button-dark text-white dark:text-gray-100 h-12 w-60 transition hover:shadow-btn font-semibold m-auto md:m-0 hover:bg-white dark:hover:bg-black hover:text-black hover:border-black dark:hover:border-white hover:border"
          >
            Create Profile
          </Link>
        </div>

        {/* Right Image: Visual representation of profile creation */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/images/profilecreate.png"
            alt="Landing"
            className="w-80 h-80 object-cover rounded-3xl shadow-lg"
            loading="lazy"
          />
        </div>
      </section>

      {/* Section 4: Features - Showcasing the platform's features */}
      <SectionTitle title="Features" />
      <section className="snap-center flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-16 text-center">
          Looking for a Perfect Institute?
        </h1>
        {/* Feature Cards Grid */}
        <div className="grid grid-rows-1 md:grid-cols-3 gap-6 md:h-96 w-full">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="flex justify-center m-auto w-full h-full hover:cursor-pointer"
              onClick={() => handleFlip(index)}
            >
              <div
                className={`flip-card w-full h-full ${isFlipped[index] ? "flipped" : ""}`}
              >
                <div className="flip-card-inner">
                  {/* Front of the Feature Card */}
                  <div className="flip-card-front w-full h-full absolute backface-hidden bg-white dark:bg-container-dark rounded-lg shadow-md p-6 text-center hover:shadow-lg flex flex-col items-center justify-between">
                    <img
                      src={card.image}
                      alt={card.front}
                      className="w-2/3 h-2/3 object-contain"
                      loading="lazy"
                    />
                    <div className="card-content md:mt-4 text-2xl">{card.front}</div>
                  </div>
                  {/* Back of the Feature Card */}
                  <div className="flip-card-back w-full h-full bg-primary-300 text-white rounded-lg shadow-md p-6 text-center hover:shadow-lg flex items-center justify-center">
                    <div className="card-content text-lg">{card.back}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Sneak Peek - Preview of platform features */}
      <SectionTitle title="Sneak Peak" />
      <section className="snap-center flex items-center flex-col justify-center px-6">
        <div className="w-full h-auto relative">
          <Swiper
            navigation={true}
            modules={[Navigation]}
            className="mySwiper relative"
          >
            <SwiperSlide>
              <img
                src="/images/SearchPage.png"
                alt="Search Page"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/images/CreateProfile.png"
                alt="Create Profile"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/images/ScholarshipManage.png"
                alt="Institute Overview"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/images/InstituteApplications.png"
                alt="Institute Applications"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* Section 6: About Us - Information about the platform */}
      <section className="snap-center flex flex-col items-center text-white">
        <SectionTitle title="About Us" />
        <div className="w-full mx-6 md:mx-32 p-10 rounded-5xl flex gap-10 justify-center items-center">
          <div className="md:w-1/2 hidden md:block h-96">
            <img src="/images/logo.png" width={500} alt="" />
          </div>
          <div className="flex flex-col gap-4 md:w-1/2 text-gray-800 dark:text-gray-200 text-lg">
            <p className="text-lg">
              GrantHive is an online platform designed to connect students seeking scholarships with scholarship providers.
            </p>
            <p>
              We aim to provide a platform that simplifies the process of finding, applying for, and tracking scholarships while providing scholarship providers with tools to manage and review applications efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* Section 7: Footer - Links and contact info */}
      <footer className="snap-center flex flex-col text-white">
        <div className="w-full h-full bg-button dark:bg-button-dark">
          <div className="h-auto px-5 md:px-10 py-16 flex flex-col md:flex-row justify-between md:items-start items-center text-xl">
            {/* Quick Links */}
            <ul className="space-y-3 mb-6 md:mb-0 text-center md:text-left">
              <li className="font-bold text-xl text-white drop-shadow-md">Quick Links</li>
              <li>About Us</li>
              <li>Our Partners</li>
              <li>FAQ</li>
              <li>Contact Us</li>
            </ul>

            {/* Resources */}
            <ul className="space-y-3 mb-6 md:mb-0 text-center md:text-left">
              <li className="font-bold text-xl text-white drop-shadow-md">Resources</li>
              <li>Scholarship List</li>
              <li>Our Partners</li>
              <li>Contact Us</li>
            </ul>

            {/* Contact Info */}
            <ul className="space-y-3 text-center md:text-left">
              <li className="font-bold text-xl text-white drop-shadow-md">Contact Info</li>
              <li className="flex gap-2 items-center justify-center md:justify-start"><FaLocationDot /> Location</li>
              <li className="flex gap-2 items-center justify-center md:justify-start"><FaPhoneAlt /> Phone No</li>
              <li className="flex gap-2 items-center justify-center md:justify-start"><MdEmail /> emaileg@gmail.com</li>
              <li className="flex gap-5 text-3xl justify-center md:justify-start">
                <FaFacebook />
                <FaXTwitter />
                <FaLinkedin />
              </li>
            </ul>
          </div>
          <hr />
          <h1 className="text-5xl text-center my-5">GrantHive</h1>
          <span className="text-sm text-center block">Privacy Policy | Terms of Service</span>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
