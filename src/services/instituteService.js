import api from "./api";
import { INSTITUTE_PROFILES, INSTITUTE_PROFILE_ID, ONE_INSTITUTE_PROFILE } from "./api";

const getInstituteProfile = async () => {
  try{const res = await api.get(INSTITUTE_PROFILES);
  return res;}catch(error){
    console.error("Error Fetching Institute Profile: ",error);
    throw error;
  }
};

const getInstituteProfilebyFilter = async (filter) => {
  const res = await api.get(`instituteprofile/filter?${filter}`);
  if (!res || res.status !== 200) {
    return { status: 404, data: [] }; // return an empty array in case of no results
  }
  return res;
};


const createInstituteProfile = async (formData) => {
  try {
    const response = await api.post(INSTITUTE_PROFILES, formData);
    return response;
  } catch (error) {
    console.error("Error Creating Institute Profile: ", error);
    throw error;
  }
};

const updateInstituteProfile = async (formData) => {
  try {
    const response = await api.put(ONE_INSTITUTE_PROFILE, formData);
    return response;
  } catch (error) {
    console.error("Error Updating Institute Profile: ", error);
    throw error;
  }
};

const getInstituteProfilebyId = async (id) => {
  try{
    const url=INSTITUTE_PROFILE_ID.replace(":id",id);
    const res = await api.get(url);
    return res;}catch(error){
       // Log the error and include context for debugging
    console.error(`Error Fetching Institute Profile for id: ${id}`, error);
    // You can throw a custom error or rethrow the original error
    throw new Error(`Failed to fetch Institute Profile for id: ${id}`);;
    }
  };

const getSingleInstituteProfile = async () => {
  try {
    const res = await api.get(ONE_INSTITUTE_PROFILE);
    return res;
  } catch (error) {
    console.error("Error Fetching Institute Profile: ", error);
    throw error;
  }
};
export { getInstituteProfile, getInstituteProfilebyFilter,createInstituteProfile,updateInstituteProfile, getInstituteProfilebyId, getSingleInstituteProfile };