// import axiosInstance from "./api";
// import TokenService from "./token-service";
// import { refreshToken } from "../actions/auth";

// const setup = (store) => {
//   axiosInstance.interceptors.request.use(
//     (config) => {
//       console.log("config use", config);
//       let role = "agent";
//       if (config.url.includes("alpha")) {
//         role = "admin";
//       }
//       const token = TokenService.getLocalAccessToken(role);
//       if (token) {
//         config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
//         //config.headers["x-access-token"] = token; // for Node.js Express back-end
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );
//   const { dispatch } = store;
//   axiosInstance.interceptors.response.use(
//     (res) => {
//       return res;
//     },
//     async (err) => {
//       const originalConfig = err.config;
//       console.log("originalConfig", originalConfig.url);
//       console.log("config use", config);
//       let role = "agent";
//       let type = "beta";
//       if (originalConfig.url.includes("alpha")) {
//         role = "admin";
//         type = "alpha";
//       }
//       if (originalConfig.url !== "login/beta/authenticate" && err.response) {
//         if (err.response.status === 401 && !originalConfig._retry) {
//           originalConfig._retry = true;

//           try {
//             const rs = await axiosInstance.post("login/beta/refreshAccessToken", {
//               refreshToken: TokenService.getLocalRefreshToken(role),
//             });

//             const { accessToken } = rs.data;

//             dispatch(refreshToken(accessToken, role));
//             TokenService.updateLocalAccessToken(accessToken, role);

//             return axiosInstance(originalConfig);
//           } catch (_error) {
//             return Promise.reject(_error);
//           }
//         }
//       }

//       return Promise.reject(err);
//     }
//   );
// };

// export default setup;