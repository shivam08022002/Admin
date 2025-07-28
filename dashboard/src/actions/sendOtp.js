import api from "../services/api";

export const sendOtpToMail=(mail,userName) =>{
    return api.post("/gamma/lucky9/registerVerification", {
      phoneNumber:userName,emailAccount:mail
    }).then(response => {
      return response;
    }).catch((error) => {
        console.log(error.response.status+ "is Status");
        return error.response;
    });

}
