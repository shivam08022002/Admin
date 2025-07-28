import axios from "axios";
import TokenService from "./token-service";

const instance = axios.create({
  //baseURL: "http://11betmen.in/wingo/",
  //  baseURL: "http://192.168.29.161:8080/",
  // baseURL: "http://192.168.29.189:8080/",
  //baseURL: "http://192.168.1.7:8080/",
  // baseURL: "http://64.227.161.65:8083/bsf/",
  // baseURL: "https://nice247.pro/backend/",
  baseURL: "https://stumpexch7.com/backend/",

  // baseURL: "http://192.168.1.12:8080/",
  //baseURL: "https://play.luckyo.in/backend/",
  //  baseURL: "https://game.play247.link/backend/",
  //  baseURL: "https://parvatibook.com/backend/",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    console.log("config use", config);
    console.log("config use 1", config.role, TokenService.getRole());
    const token = TokenService.getLocalAccessToken();
    // console.log("access token", token);
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
      //config.headers["x-access-token"] = token; // for Node.js Express back-end
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    console.log("err.config", err.config);
    // if (originalConfig.url !== "rest/v1/authenticate" && err.response) {
    if (originalConfig.url !== "login/beta/authenticate" && err.response) {
      // Access Token was expired
      console.log("err.response", err.response);
      console.log("err.response.status", err.response.status, originalConfig._retry);
      console.log("err.config.headers", err.config.headers);
      const NO_RETRY_HEADER = 'x-no-retry';
      if (err.response.status === 403 && originalConfig.headers
        && !originalConfig.headers[NO_RETRY_HEADER]) {
        originalConfig.headers ||= {}
        originalConfig.headers[NO_RETRY_HEADER] = 'true' // string val only

        try {
          // const rs = await instance.post("rest/v1/generateRefreshToken", {
          const rs = await instance.post("login/beta/refreshAccessToken", {
            refreshToken: TokenService.getLocalRefreshToken()
          });

          const { accessToken } = rs.data;
          TokenService.updateLocalAccessToken(accessToken);
          
          TokenService.removeUser();
          TokenService.setUser(rs.data);
          console.log("access token", accessToken);

          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default instance;