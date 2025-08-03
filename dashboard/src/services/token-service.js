class TokenService {
  getUserName() {
    const user = JSON.parse(localStorage.getItem("master"));
    return user?.userName;
  }
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem("master"));
    return user?.refreshToken;
  }

  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem("master"));
    return user?.accessToken;
  }

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem("master"));
    user.accessToken = token;
    localStorage.setItem("master", JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem("master"));
  }

  setUser(user) {
    console.log("setUser", "master");
    console.log("master", JSON.stringify(user));
    localStorage.setItem("master", JSON.stringify(user));
  }

  getRole() {
    const user = JSON.parse(localStorage.getItem("master"));
    return user?.entityType;
  }

  removeUser() {
    console.log("removeUser", "master");
    localStorage.removeItem("agent_NotPopup");
    localStorage.removeItem("master");
  }

  updateBalance(balance) {
    let user = JSON.parse(localStorage.getItem("master"));
    user.balance = balance;
    localStorage.setItem("master", JSON.stringify(user));
  }

  notificationPopupDisplayed(userId) {
    localStorage.setItem("agent_NotPopup", 1);
  }

  isNotificationPopupDisplayed(userId) {
    console.log(userId);
    return localStorage.getItem("agent_NotPopup");
  }
}
// TokenService = new TokenService();
export default new TokenService();