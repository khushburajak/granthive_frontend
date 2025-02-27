import api from "./api";
import { STUDENT_PROFILE, STUDENT_DATA } from "./api";

const getProfile = async () => {
  try {
    const res = await api.get(STUDENT_DATA);
    return res;
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (formData) => {
  try {
    const res = await api.put(STUDENT_PROFILE, formData);
    return res;
  } catch (error) {
    console.error("Error Updating Profile: ", error);
    throw error;
  }
};

const createStudentProfile = async (formData) => {
  try {
    const res = await api.post("/studentprofile", formData);
    return res;
  } catch (error) {
    throw error;
  }
};

export { getProfile, updateProfile, createStudentProfile };
