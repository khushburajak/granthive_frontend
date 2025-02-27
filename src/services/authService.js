import api from "./api";
import { REGISTER, LOGIN, CHANGEPASSWORD } from "./api";
const register = async (formData) => {
  try {
    const res = await api.post(REGISTER, formData);
    return res.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      // Handle different status codes
      if (status === 400) {
        if (data && data.errors) {
          const errormessage = data.errors.map((error) => error.msg).join("\n");
          return errormessage;
        }
        if (data && data.message) {
          return data.message;
        }

        return "Bad Request: Please check the data you have provided.";
      } else if (status === 401) {
        return "Unauthorized: Please check your credentials.";
      } else if (status === 404) {
        return "Not Found: The requested resource could not be found.";
      } else if (status === 500) {
        return "Server Error: Something went wrong on our end. Please try again later.";
      } else {
        return data
          ? data.message
          : "An error occurred. Please try again later.";
      }
    } else {
      return (
        error.message || "Network Error: Please check your internet connection."
      );
    }
  }
};

const login = async (formData) => {
  try {
    const res = await api.post(LOGIN, formData);
    return res;
  } catch (error) {
    console.error("Error Logging In: ", error);
    throw error;
  }
};

const ChangePassword = async (formData) => {
  try {
    const res = await api.put(CHANGEPASSWORD, formData);
    return res;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      // Handle different status codes
      if (status === 400) {
        if (data && data.errors) {
          const errormessage = data.errors.map((error) => error.msg).join("\n");
          return errormessage;
        }
        if (data && data.message) {
          return data.message;
        }

        return "Bad Request: Please check the data you have provided.";
      }
      else if (status === 200) {
        return "Password saved successfully!";
      } else if (status === 500) {
        return "An error occurred on the server. Please try again later.";
      } else {
        return "Password update failed. Please try again.";
      }
    }
  }
};

export { register, login, ChangePassword };


