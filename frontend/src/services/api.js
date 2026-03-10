import axios from "axios";

export const submitReport = (data) => {
  return axios.post("http://localhost:5000/api/report/create", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};