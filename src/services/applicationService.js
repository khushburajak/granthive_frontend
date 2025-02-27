import api, { APPLICATION_BY_INSTITUTE, APPLICATION_BY_STUDENT, APPLICATION_BY_ID, APPLICATION_CHECK, CREATE_APPLICATION, UPDATE_APPLICATION } from "./api";
import axios from "axios";

const updateApplicationStatus = async (id, status) => {
    const url = UPDATE_APPLICATION.replace(":id", id);
    const response = await api.put(url, { status });
    return response.data.application;
};
const getApplicationFromStudent = async () => {
    try {

        const res = await api.get(APPLICATION_BY_STUDENT);
        return res;
    } catch (error) {
        console.error("Error Fetching Applications: ", error);
        throw error;
    }

};
const getApplicationById = async (id) => {
    try {
        const res = await api.get(APPLICATION_BY_ID.replace(":id", id));
        return res;
    } catch (error) {
        console.error("Error Fetching Application:", error);
        throw error;
    }
};

const getApplicationByInstitute = async () => {
    try {
        const res = await api.get(APPLICATION_BY_INSTITUTE);
        return res;
    } catch (error) {
        console.error("Error Fetching Applications: ", error);
        throw error;
    }
};

const checkApplication =async (Course_id) => {
    try {
        const url = APPLICATION_CHECK.replace(":id", Course_id);
        const res = await api.get(url);
        return res.data;
    }
    catch (error){
        console.error(`Error checking application for course id: ${Course_id}`, error);  
        throw new Error(`Failed to checking application for course id: ${Course_id}`);
    }
};

const createApplication = async (Course_id, formData) => {
    try {
        const url = CREATE_APPLICATION.replace(":id", Course_id);
        const res = await api.post(url, formData);
        return res;
    } catch (error) {
        // Log the error and include context for debugging
        console.error(`Error Submitting Application for course id: ${Course_id}`, error);
        // You can throw a custom error or rethrow the original error
        throw new Error(`Failed to submit application for course id: ${Course_id}`);
    }
};

export {
    getApplicationFromStudent,
    getApplicationByInstitute,
    getApplicationById,
    checkApplication,
    createApplication,
    updateApplicationStatus
}
