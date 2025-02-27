import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { SidebarProvider } from "./context/SidebarContext.jsx"

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";

import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

import HomePage from "./pages/HomePage";
import InstituteSearch from "./pages/InstituteSearch";
import InstituteProfile from "./pages/InstituteProfile";

//Student Routes
import StudentProfileCreationForm from "./components/StudentComponents/StudentProfileCreationForm.jsx";
import StudentDashboard from "./components/StudentComponents/StudentDashboard";
import StudentProfileForm from "./components/StudentComponents/StudentProfileForm.jsx";
import StudentOverview from "./components/StudentComponents/StudentOverview";
import StudentApplications from "./components/StudentComponents/StudentApplications.jsx";
import StudentSetting from "./components/StudentComponents/StudentSettings.jsx";
import StudentApplicationDetails from "./components/StudentComponents/StudentApplicationDetails";

//Institute Routes
import InstituteProfileCreationForm from "./components/InstituteComponents/InstituteProfileCreationForm.jsx";
import InstituteDashboard from "./components/InstituteComponents/InstituteDashboard";
import InstituteProfileForm from "./components/InstituteComponents/InstituteProfileForm";
import InstituteOverview from "./components/InstituteComponents/InstituteOverview";
import InstituteApplications from "./components/InstituteComponents/InstituteApplications.jsx";
import InstituteSetting from "./components/InstituteComponents/InstituteSettings.jsx";
import InstituteApplicationDetails from "./components/InstituteComponents/InstituteApplicationDetail.jsx";
import ScholarshipForm from "./components/InstituteComponents/ScholarshipForm";

function App() {
  return (
    <Router>
      <SidebarProvider>
      <Routes>
        <Route path="/" element={<PublicRoute />}>
          <Route index element={<HomePage />} />s
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="institutesearch" element={<InstituteSearch />} />
          <Route path="InstituteProfile" element={<InstituteProfile />} />
        </Route>

        {/* Testing institute dashboard*/}
        <Route
          path="/institution"
          element={<PrivateRoute allowedRoles={["Institution"]} />}
        >
          <Route path="instituteprofile/create" element={<InstituteProfileCreationForm />} />

          <Route path="dashboard" element={<InstituteDashboard />}>
            <Route index element={<InstituteProfileForm />} />
            <Route path="profile" element={<InstituteProfileForm />} />
            <Route path="scholarships/create" element={<ScholarshipForm />} />
            <Route path="overview" element={<InstituteOverview />} />
            <Route path="applications" element={<InstituteApplications />} />
            <Route path="applicationdetail" element={<InstituteApplicationDetails />} />
            <Route path="setting" element={<InstituteSetting />} />
          </Route>
        </Route>

        {/* Testing students dashboard*/}
        <Route
          path="/student"
          element={<PrivateRoute allowedRoles={["Student"]} />}
        >
          <Route path="dashboard" element={<StudentDashboard />}>
            {/* Route for dashboard components here */}
            <Route index element={<StudentProfileForm />} />
            <Route path="profile" element={<StudentProfileForm />} />
            <Route path="overview" element={<StudentOverview />} />
            <Route path="applications" element={<StudentApplications />} />
            <Route path="setting" element={<StudentSetting />} />
            <Route path="applicationdetails" element={<StudentApplicationDetails />} />
          </Route>
          <Route path="studentprofile/create" element={<StudentProfileCreationForm />} />
        </Route>
        <Route path="/unauthorized" element={<>Unauthorized</>} />
      </Routes>
      </SidebarProvider>
    </Router>
  );
}

export default App;
