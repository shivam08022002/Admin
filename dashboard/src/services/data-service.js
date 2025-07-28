import TokenService from "./token-service";

export default function authHeader(role) {
  const user = TokenService.getUser(role);
  console.log('user', user)
  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken };
  } else {
    return {};
  }
}
