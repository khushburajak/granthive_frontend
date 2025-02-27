import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/v1";

//auth routes
export const REGISTER = "/auth/register";
export const LOGIN = "/auth/login";
export const CHANGEPASSWORD = "/auth/changepassword";
export const STUDENT_DATA = "/auth/users/student/id";

//profile routes
export const STUDENT_PROFILE = "/studentprofile/id";
export const ONE_INSTITUTE_PROFILE = "/instituteprofile/id";
export const INSTITUTE_PROFILES = "/instituteprofile";
export const INSTITUTE_PROFILE_ID = "/instituteprofile/id/:id";

//course routes
export const CREATE_COURSE = "/course"
export const UPDATE_COURSE = "/course/:id";
export const COURSE_ID_ROUTE = "/course/id/:id"
export const COURSE_BY_INSTITUTE="/course/institute"
export const COURSES_BY_INSTITUTE_ID_ROUTE = "/course/institute/:id";

//application routes
export const CREATE_APPLICATION = "/application/:id";
export const UPDATE_APPLICATION = "/application/:id";
export const APPLICATION_BY_STUDENT = "/application/id";
export const APPLICATION_BY_COURSE = "/application/course/:id";
export const APPLICATION_BY_INSTITUTE = "/application/institute";
export const APPLICATION_BY_ID = "/application/id/:id";
export const APPLICATION_CHECK = "/application/check/:id";

//upload routes
export const STUDENT_PFP="/upload/student/profilepicture"
export const STUDENT_DOCUMENT="/upload/student/document"
export const INSTITUTE_PFP="/upload/institute/profilepicture"
export const INSTITUTE_CP="/upload/institute/coverphoto"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
