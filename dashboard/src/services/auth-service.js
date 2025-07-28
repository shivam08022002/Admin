import axios from "axios";
import authHeader from "./data-service"

//const API_URL = "http://192.168.29.60:4000/";
// const API_URL = "http://192.168.29.36:8080/";
// const API_URL = "http://192.168.29.239:8080/";
// const API_URL = "http://192.168.29.189:8080/";
const API_URL = "http://192.168.29.161:8080/";

// const register = (name, username, email, password, phone, balance, role) => {
//   return axios.post(API_URL + "users", {
//     name,
//     username,
//     email,
//     password,
//     phone,
//     balance,
//     role
//   });
// };

const register = (name, username, email, password, mobileNo, initialBalance, commission, role, update) => {
  const user = TokenService.getUser(role);
  if (!update) {
    console.log("addAgent", user.accessToken)
    console.log(authHeader())
    let tailURL = "alpha/addAgent";
    if (role === "agent") {
      tailURL = "beta/addUser";
    }

    return axios.post(API_URL + tailURL, {
      name,
      username,
      password,
      mobileNo,
      initialBalance,
      commission
    }, { headers: authHeader() });
  } else {
    console.log("updateAgent", user.accessToken)
    console.log(authHeader())
    let tailURL = "alpha/updateAgent";
    if (role === "agent") {
      tailURL = "beta/updateUser";

      return axios.post(API_URL + tailURL, {
        name,
        username,
        password,
        mobileNo,
        initialBalance
      }, { headers: authHeader() });
    } else {
      return axios.post(API_URL + tailURL, {
        name,
        username,
        password,
        mobileNo,
        initialBalance,
        commission
      }, { headers: authHeader() });
    }
  }
};

const block = (userName, accountStatus, role) => {
  const user = TokenService.getUser(role);
  console.log("block", user.accessToken)
  console.log("block", userName)
  console.log(authHeader())
  let tailURL = "alpha/blockAgent";
  if (accountStatus === "BLOCKED") {
    tailURL = "alpha/unblockAgent";
    if (role === "agent") {
      tailURL = "beta/unblockUser";
    }
  } else {
    if (role === "agent") {
      tailURL = "beta/blockUser";
    }
  }

  return axios.post(API_URL + tailURL, {
    userName
  }, { headers: authHeader() });
};

const login = (username, password, role) => {
  console.log(JSON.stringify({ username, password }));
  return axios
    // .post(API_URL + "rest/v1/authenticate", JSON.stringify({
    .post(API_URL + "login/beta/authenticate", JSON.stringify({
      username,
      password
    }),
      {
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*",
          "Access-Control-Allow-Origin": "*"
        },
      })
    .then((response) => {
      console.log("resp", response.data)

      if (response.data.accessToken || response.data.accountStatus === "NEW") {
        TokenService.setUser(response.data);
      }

      return response.data;
    });
};

const logout = (role) => {
  TokenService.removeUser();
};

const changePassword = (oldPassword, newPassword, userName, role) => {
  // return axios.post(API_URL + "rest/v1/" + role + "/changePassword", {
  return axios.post(API_URL + "login/beta/" + role + "/changePassword", {
    oldPassword,
    newPassword,
    userName
  }).then((response) => {
    console.log("cpresp", response.data)

    if (response.data.accessToken) {
      TokenService.setUser(response.data);
    }

    return response.data;
  });
};

const overrideResult = (gameId, winner, role) => {
  const user = TokenService.getUser(role);
  console.log("overrideResult", user.accessToken)
  console.log(authHeader())
  const adminName = user.userName;
  const tailURL = "alpha/override/result";

  return axios.post(API_URL + tailURL, {
    gameId,
    adminName,
    winner
  }, { headers: authHeader() });
};

export default {
  register,
  login,
  logout,
  changePassword,
  block,
  overrideResult
};