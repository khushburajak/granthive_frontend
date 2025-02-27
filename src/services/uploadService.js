import api, {INSTITUTE_PFP, INSTITUTE_CP, STUDENT_PFP, STUDENT_DOCUMENT} from "./api";


//Student Profile Picture 
const uploadStudentProfilePicture = async (formData) => {
    try {
        const res = await api.post(STUDENT_PFP, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // Axios will automatically handle this header
            },
        });

        return res;
    } catch (error) {
        console.error("Error Uploading Student Profile Picture: ", error);
        throw error;
    }
};

//upload student Document
const uploadStudentDocument = async (formData) => {
    try {
        const res = await api.post(STUDENT_DOCUMENT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // Axios will automatically handle this header
            },
        });

        return res;
    } catch (error) {
        console.error("Error Uploading Student Document: ", error);
        throw error;
    }
};

//Institute Profile Picture 
const uploadInstituteProfilePicture = async (formData) => {
    try {
        const res = await api.post(INSTITUTE_PFP, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // Axios will automatically handle this header
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error Uploading Student Profile Picture: ", error);
        throw error;
    }
}

//Institue Cover
const uploadInstituteCoverPhoto = async (formData) => {
    try {
        const res = await api.post(INSTITUTE_CP, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // Axios will automatically handle this header
            },
        });
        return res;
    } catch (error) {
        console.error("Error Uploading Institute Cover Photo: ", error);
        throw error;
    }
}

export { 
    uploadStudentProfilePicture, 
    uploadStudentDocument,
    uploadInstituteProfilePicture,
    uploadInstituteCoverPhoto,
};

