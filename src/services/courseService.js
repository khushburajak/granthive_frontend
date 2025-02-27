import api, {COURSES_BY_INSTITUTE_ID_ROUTE,CREATE_COURSE, COURSE_BY_INSTITUTE, UPDATE_COURSE } from "./api";

const getCoursesByInstituteId = async (instituteId) => {
  try {
    const url = COURSES_BY_INSTITUTE_ID_ROUTE.replace(":id", instituteId);
    const res = await api.get(url);
    return res;
  } catch (error) {
    console.error("Error Fetching Courses: ", error);
    throw error;
  }
};

const createCourse = async (formData) =>{
    try{
        const res = await api.post(CREATE_COURSE,formData);
        return res;
    }catch(error){
        console.error("Error Creating Course Offer: ", error);
        throw error;
    }
};

const updateCourse = async (courseId,formData) => {
    try{
        const url = UPDATE_COURSE.replace(":id", courseId);
        const res = await api.put(url,formData);
        return res;
    }catch(error){
        console.error("Error Updating Course: ", error);
        throw error;
    }
};

const deleteCourse = async (courseId) => {
    try{
        const url = UPDATE_COURSE.replace(":id", courseId);
        const res = await api.delete(url);
        return res;
    }catch(error){
        console.error("Error Deleting Course: ", error);
        throw error;
    }
};

const getCourseByInstitute = async () => {
  try {
    const res = await api.get(COURSE_BY_INSTITUTE);
    return res;
  } catch (error) {
    console.error("Error Fetching Courses: ", error);
    throw error;
  }
};

export {getCoursesByInstituteId,createCourse,updateCourse,getCourseByInstitute, deleteCourse};