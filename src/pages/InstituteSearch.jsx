import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { RiArrowDropRightLine, RiArrowDropLeftLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getInstituteProfile, getInstituteProfilebyFilter } from "../services/instituteService";
import Sidebar from "../components/Common/defaultSidebar";

const InstituteSearch = () => {
  const { authState } = useAuth();
  const { token, role } = authState;

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [isScholarshipOpen, setIsScholarshipOpen] = useState(false);
  const [selectedScholarshipType, setSelectedScholarshipType] = useState([]);
  const [countriesAndCitiesMap, setCountriesAndCitiesMap] = useState({});
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instituteInfo, setInstituteInfo] = useState({});

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const fetchInstituteInfo = async () => {
      try {
        const response = await getInstituteProfile();
        if (response.status === 200) {
          const json = response.data.data;
          setInstituteInfo(json);

          const countriesAndCities = json.reduce((acc, institute) => {
            const country = institute.location.country;
            const city = institute.location.city;
            if (country && city) {
              if (!acc[country]) acc[country] = [];
              acc[country].push(city);
            }
            return acc;
          }, {});
          setCountriesAndCitiesMap(countriesAndCities);

          const allCourses = json.reduce((acc, institute) => {
            const instituteCourses = institute.courses.map(course => course.title);
            instituteCourses.forEach(course => {
              if (!acc.includes(course)) acc.push(course);
            });
            return acc;
          }, []);
          setCourses(allCourses);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInstituteInfo();
  }, []);

  const handleSearch = () => { };

  const handleCourseSelection = (course) => {
    setSelectedCourses(prevSelectedCourses =>
      prevSelectedCourses.includes(course)
        ? prevSelectedCourses.filter(item => item !== course)
        : [...prevSelectedCourses, course]
    );
  };

  const handleCountryChange = (country) => {
    setSelectedCountries(prevSelectedCountries =>
      prevSelectedCountries.includes(country)
        ? prevSelectedCountries.filter(item => item !== country)
        : [...prevSelectedCountries, country]
    );
    handleLocationChange(country);
  };

  const handleCityChange = (city) => {
    setSelectedCities(prevSelectedCities =>
      prevSelectedCities.includes(city)
        ? prevSelectedCities.filter(item => item !== city)
        : [...prevSelectedCities, city]
    );
    handleLocationChange(city);
  };

  const handleLocationChange = (country = "", city = "") => {
    setSelectedLocations(prevSelectedLocations => {
      const location = { city, country };
      const isSelected = prevSelectedLocations.some(
        loc => loc.country === location.country && loc.city === location.city
      );
      return isSelected
        ? prevSelectedLocations.filter(
          loc => loc.country !== location.country || loc.city !== location.city
        )
        : [...prevSelectedLocations, location];
    });
  };

  const handleScholarshipTypeSelection = (scholarshipType) => {
    setSelectedScholarshipType(prevSelectedScholarshipType =>
      prevSelectedScholarshipType.includes(scholarshipType)
        ? prevSelectedScholarshipType.filter(item => item !== scholarshipType)
        : [...prevSelectedScholarshipType, scholarshipType]
    );
  };

  const buildFilter = () => {
    let filter = "";

    if (selectedCountries.length > 0) {
      filter += `country=${selectedCountries.join(",")}`;
    }

    if (selectedCities.length > 0) {
      filter += filter ? `&city=${selectedCities.join(",")}` : `city=${selectedCities.join(",")}`;
    }

    if (selectedCourses.length > 0) {
      filter += filter ? `&course=${selectedCourses.join(",")}` : `course=${selectedCourses.join(",")}`;
    }

    if (searchQuery !== "") {
      filter += filter ? `&search=${searchQuery}` : `search=${searchQuery}`;
    }

    if (selectedScholarshipType.length > 0) {
      filter += filter ? `&scholarship_type=${selectedScholarshipType.join(",")}` : `scholarship_type=${selectedScholarshipType.join(",")}`;
    }

    return filter;
  };

  useEffect(() => {
    const fetchFilteredInstitutes = async () => {
      setLoading(true);
      try {
        let filter = "";
        if (selectedLocations.length === 0 && selectedCountries.length === 0 && selectedCities.length === 0 && selectedCourses.length === 0 && searchQuery === "" && selectedScholarshipType.length === 0) {
          filter = "";
        } else {
          filter = buildFilter();
        }

        const response = await getInstituteProfilebyFilter(filter);
        if (response.status === 200 && response.data.data.length > 0) {
          setInstituteInfo(response.data.data);
        } else {
          setInstituteInfo([]);
          setError("No institutes found");
        }
      } catch (err) {
        setError(err.message);
        setInstituteInfo([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredInstitutes();
  }, [selectedLocations, selectedCountries, selectedCities, selectedCourses, searchQuery, selectedScholarshipType]);

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : description;
  };

  const toggleSidebarHere = () => {
    setIsSidebarVisible(prevState => !prevState);
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-background-dark transition-all duration-300 ${isSidebarVisible ? "lg:ml-48" : ""}`}>
      <header className="bg-container dark:bg-container-dark text-white">
        <nav className="flex items-center justify-between p-4 max-w-screen-xl mx-auto dark:text-white dark:bg-container-dark">
          <div className="cursor-pointer hidden sm:block" onClick={toggleSidebarHere}>
            {isSidebarVisible ? (
              <RiArrowDropLeftLine className="text-black dark:text-white text-3xl sm:text-5xl" />
            ) : (
              <RiArrowDropRightLine className="text-black dark:text-white text-3xl sm:text-5xl" />
            )}
          </div>
          <div className="flex-grow flex justify-center">
            <div className="relative w-3/5 ml-5 md:ml-0 md:w-full max-w-xs sm:max-w-md">
              <input
                type="text"
                placeholder="Search for scholarships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 pl-4 md:pl-10 pr-10 rounded-full bg-white border border-gray-300 w-full text-black dark:bg-container-dark dark:text-white"
              />
              <IoSearch onClick={handleSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
            </div>
          </div>
          {role === "Institution" && (
            <Link to="/institution/dashboard/scholarships/create" className="text-sm sm:text-base whitespace-nowrap">
              Create Scholarship
            </Link>
          )}
        </nav>
      </header>

      {isSidebarVisible && <Sidebar />}

      <main className="flex flex-col lg:flex-row justify-between p-4 max-w-screen-xl mx-auto bg-background dark:bg-background-dark">
        <div className="w-full lg:w-1/4 bg-container p-4 rounded-lg mb-6 lg:mb-0 mr-0 lg:mr-8 dark:bg-container-dark dark:text-white">
          <h2 className="font-semibold text-lg mb-4">Filters</h2>

          <div>
            <h3 onClick={() => setIsCoursesOpen(!isCoursesOpen)} className="font-semibold text-lg cursor-pointer mb-4">
              Courses:
            </h3>
            {isCoursesOpen && (
              <div className="bg-white p-4 rounded-lg shadow-md dark:text-white dark:bg-background-dark">
                <form>
                  <ul>
                    {courses.map((course, index) => (
                      <li key={index} className="py-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="course"
                            value={course}
                            checked={selectedCourses.includes(course)}
                            onChange={() => handleCourseSelection(course)}
                            className="h-4 w-4 text-blue-500"
                          />
                          <span>{course}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                  {selectedCourses.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600">
                      <p><strong>Selected Courses: </strong>{selectedCourses.join(", ")}</p>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>

          <div>
            <h3 onClick={() => setIsLocationOpen(!isLocationOpen)} className="font-semibold text-lg cursor-pointer mb-4">
              Location:
            </h3>
            {isLocationOpen && (
              <div className="bg-white p-4 rounded-lg shadow-md dark:bg-background-dark dark:text-white">
                <ul>
                  {Object.entries(countriesAndCitiesMap).map(([country, cities], index) => (
                    <li key={index} className="py-2">
                      <div className="font-semibold mt-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedCountries.includes(country)}
                            onChange={() => handleCountryChange(country)}
                            className="h-4 w-4 text-blue-500"
                          />
                          <span>{country}</span>
                        </label>
                      </div>
                      {selectedCountries.includes(country) && (
                        <ul>
                          {cities.map((city, idx) => (
                            <li key={idx}>
                              <label className="flex items-center space-x-2 ml-4">
                                <input
                                  type="checkbox"
                                  checked={selectedCities.includes(city)}
                                  onChange={() => handleCityChange(city)}
                                  className="h-4 w-4 text-blue-500"
                                />
                                <span>{city}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <h3 onClick={() => setIsScholarshipOpen(!isScholarshipOpen)} className="font-semibold text-lg cursor-pointer mb-4">
              Scholarship Type:
            </h3>
            {isScholarshipOpen && (
              <div className="bg-white p-4 rounded-lg shadow-md dark:bg-background-dark dark:text-white">
                <form>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedScholarshipType.includes("Full Scholarship")}
                      onChange={() => handleScholarshipTypeSelection("Full Scholarship")}
                      className="h-4 w-4 text-blue-500"
                    />
                    <span>Full Scholarship</span>
                  </label>
                  <label className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      checked={selectedScholarshipType.includes("Partial Scholarship")}
                      onChange={() => handleScholarshipTypeSelection("Partial Scholarship")}
                      className="h-4 w-4 text-blue-500"
                    />
                    <span>Partial Scholarship</span>
                  </label>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Institute Cards */}
        {/* Institute Cards */}
        <div className="flex flex-col gap-6 w-full dark:text-white">
          {loading ? (
            <p>Loading...</p>
          ) : Array.isArray(instituteInfo) && instituteInfo.length > 0 ? (
            instituteInfo.map((institute, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row bg-container p-4 rounded-lg shadow-md w-full hover:bg-white transition dark:bg-container-dark hover:dark:bg-background-dark dark:text-white"
              >
                {/* Left Side: Logo */}
                <div className="w-full sm:w-1/4 flex items-center justify-center">
                  <img
                    src={institute?.image || "http://example.com/default-image.jpg"}
                    alt={`${institute?.name || "Institute"} Logo`}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>

                {/* Right Side: Content */}
                <div className="w-full sm:w-3/4 pl-4 relative">
                  {/* Institute Name */}
                  <h3 className="font-semibold text-2xl mb-2 text-gray-900 dark:text-white">
                    {institute.name}
                  </h3>

                  {/* Institute Info */}
                  {institute ? (
                    <div className="mb-4">
                      <p className="font-medium text-lg text-gray-700 dark:text-white">
                        University: {institute.university}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-white">
                        Location: {institute.location.city}, {institute.location.country}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4 dark:text-white">
                      Loading institute info...
                    </p>
                  )}

                  {/* Institute Description */}
                  <p className="text-gray-700 mb-4 w-3/4 dark:text-white justify-normal">
                    {truncateDescription(institute.description, 20)} {/* Limit to 20 words */}
                  </p>

                  {/* Learn More Button */}
                  <Link
                    to={`/InstituteProfile`} // You should replace this with dynamic routing if needed
                    state={{ userId: institute.userId }}
                    className="absolute bottom-4 right-4 px-4 py-2 bg-button dark:bg-button-dark text-white rounded-full hover:bg-button-hover dark:hover:bg-button-darkhover transition dark:text-white dark:bg-buttonDark"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No colleges found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default InstituteSearch;
