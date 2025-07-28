import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REFRESH_TOKEN,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
  DEPOSIT_SUCCESS,
  DEPOSIT_FAIL,
  WITHDRAW_SUCCESS,
  WITHDRAW_FAIL,
  UPDATE_BALANCE_SUCCESS,
  SET_MESSAGE,
  MAKE_TRANSACTION_SUCCESS,
  MAKE_TRANSACTION_FAIL,
  UPDATE_GLOBAL_PROPERTY_SUCCESS
} from "../actions/types";
import TokenService from "../services/token-service";

let user = TokenService.getUser();
console.log("auth", user)

const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

export default function (state = initialState, action) {
  const { type, payload, role } = action;
  console.log("auth1", role, type, payload)
  let user = initialState;
  if (role) {
    user = TokenService.getUser();
    console.log("auth", user)

    const initialState = user
      ? { isLoggedIn: true, user }
      : { isLoggedIn: false, user: null };
    state = user;
  }
  // if (payload) {
  //   console.log("auth11", type, payload.data)
  //   console.log("auth12", type, payload.user)
  // }
  if (type === REGISTER_SUCCESS || type === DEPOSIT_SUCCESS
    || type === WITHDRAW_SUCCESS || type === UPDATE_BALANCE_SUCCESS) {
    if (role) {
      user = TokenService.getUser();
      console.log("auth", user)
      console.log("auth2", type, user);
      user.balance = payload.data.balance
      console.log("auth3", type, user.balance, user);
      if (payload.data.accessToken) {
        user.accessToken = payload.data.accessToken;
      }
      if (payload.data.refreshToken) {
        user.refreshToken = payload.data.refreshToken;
      }
      TokenService.setUser(user)
    }
  }

  switch (type) {
    case UPDATE_BALANCE_SUCCESS:
      console.log("ubs", payload);
      return {
        user: payload
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: user
      };
    case REGISTER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case REFRESH_TOKEN:
      return {
        ...state,
        user: { ...user, accessToken: payload },
      };
    case CHANGE_PASSWORD_SUCCESS:
      console.log("case cp success", payload)
      console.log("case cp 1 success", payload.user)
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user.data,
      };
    case CHANGE_PASSWORD_FAIL:
      console.log("case cp", payload)
      console.log("case cp 1", payload.user)
      return {
        ...state,
        isLoggedIn: false,
        user: user,
      };
    case SET_MESSAGE:
    case MAKE_TRANSACTION_SUCCESS:
    case UPDATE_GLOBAL_PROPERTY_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: user,
      };
    // case CHANGE_PASSWORD_FAIL:
    //   return {
    //     ...state,
    //     isLoggedIn: false,
    //     user: null,
    //   };
    default:
      return {
        ...state
      }
  }
}
