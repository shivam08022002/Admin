import api from "./api";
import TokenService from "./token-service";

class AuthServices {
  login(userId, password) {
    return api
      // .post("rest/v1/authenticate", JSON.stringify({
      .post("login/beta/authenticate", JSON.stringify({
        userId,
        password
      }))
      .then(response => {
        console.log("res login", response);
        TokenService.setUser(response.data);

        return response.data;
      });
  }

  logout(role) {
    TokenService.removeUser();
  }

  register(firstName, lastName, password, entityType, balance, share, matchCommission, sessionCommission, iCasinoEnabled, iCasinoShare, role) {
    console.log("register agent 2");
    let tailURL = "beta/addSubEntity";
    console.log("add", tailURL);
    return api.post(tailURL, {
      firstName,
      lastName,
      password,
      entityType,
      balance,
      share,
      matchCommission,
      sessionCommission,
      iCasinoEnabled,
      iCasinoShare
    }, { role }).then(response => {
      return response;
    });
    // if (entityType.includes("user")) {
    //   tailURL = "beta/addUser";

    //   console.log("add", tailURL);
    //   return api.post(tailURL, {
    //     firstName,
    //     lastName,
    //     password,
    //     entityType,
    //     balance,
    //     share,
    //     matchCommission,
    //     sessionCommission
    //   }, { role }).then(response => {
    //     return response;
    //   });
    // } else {
    //   console.log("add", tailURL);
    //   return api.post(tailURL, {
    //     firstName,
    //     lastName,
    //     password,
    //     entityType,
    //     balance,
    //     matchCommission,
    //     sessionCommission
    //   }, { role }).then(response => {
    //     return response;
    //   });
    // }
  }

  editAgent(userId, status, matchCommission, sessionCommission, entityType) {
    console.log("edit agent 2");
    let tailURL = "beta/updateSubEntity";
    console.log("edit", tailURL);
    return api.post(tailURL, {
      userId,
      status,
      matchCommission,
      sessionCommission,
      entityType
    }).then(response => {
      return response;
    });
  }

  editUser(userName, name, status, password, exposureLimit) {
    console.log("edit usr 2");
    let tailURL = "beta/updateUser";
    console.log("edit", tailURL);
    return api.post(tailURL, {
      userName,
      name,
      status,
      password,
      exposureLimit
    }).then(response => {
      return response;
    });
  }

  registerGames(title, date, startTime, player1, player2, role) {
    let tailURL = "alpha/addNewGame";
    console.log("register games 2", tailURL);
    return api.post(tailURL, {
      title,
      date,
      startTime,
      player1,
      player2
    }, { role }).then(response => {
      return response;
    });
  }

  startGame(id, streamLink, player1BackRate, player2BackRate, player1LayRate, player2LayRate) {
    console.log("run game");
    let tailURL = "alpha/runGame";
    console.log("run game 2", tailURL);
    return api.post(tailURL, {
      id,
      streamLink,
      player1BackRate,
      player2BackRate,
      player1LayRate,
      player2LayRate
    }).then(response => {
      return response;
    });
  }

  updateGameStatus(id, gameStatus, winner) {
    console.log("game status");
    let tailURL = "alpha/updateGameStatus";
    console.log("game status 2", tailURL);
    return api.post(tailURL, {
      id,
      gameStatus,
      winner
    }).then(response => {
      return response;
    });
  }

  notify(id, message) {
    console.log("notify");
    let tailURL = "alpha/notifyUsers";
    console.log("add", tailURL);
    return api.post(tailURL, {
      id,
      message
    }).then(response => {
      return response;
    });
  }

  depositAgent(userId, amount, remark) {
    console.log("deposit agent");
    let tailURL = "beta/depositAmount";
    console.log("add", tailURL);
    return api.post(tailURL, {
      userId,
      amount,
      remark
    }).then(response => {
      return response;
    });
  }

  depositAgentParvati(amount, remark, childName, password, creditReference) {
    console.log("deposit agent");
    let tailURL = "beta/depositAmount";
    console.log("add", tailURL);
    return api.post(tailURL, {
      amount,
      remark,
      childName,
      password,
      creditReference
    }).then(response => {
      return response;
    });
  }

  withdrawAgent(userId, amount, remark) {
    console.log("withdraw agent");
    let tailURL = "beta/withdrawAmount";
    console.log("add", tailURL);
    return api.post(tailURL, {
      userId,
      amount
    }).then(response => {
      return response;
    });
  }

  withdrawAgentParvati(amount, remark, childName, password, creditReference) {
    console.log("withdraw agent");
    let tailURL = "beta/withdrawAmount";
    console.log("add", tailURL);
    return api.post(tailURL, {
      amount,
      remark,
      childName,
      password,
      creditReference
    }).then(response => {
      return response;
    });
  }

  deposit(agentName, balance, password, role) {
    let tailURL = "alpha/depositAmount"
    if (role === "agent") {
      tailURL = "beta/depositAmount";
    }
    console.log("deposit", tailURL);
    return api.post(tailURL, {
      agentName,
      balance,
      password
    }).then(response => {
      return response;
    });
  }

  withdraw(agentName, balance, password, role) {
    let tailURL = "alpha/withdrawAmount"
    if (role === "agent") {
      tailURL = "beta/withdrawAmount";
    }
    console.log("withdraw", tailURL);
    return api.post(tailURL, {
      agentName,
      balance,
      password
    }).then(response => {
      return response;
    });
  }

  makeTransaction(userId, remark, type, amount) {
    console.log("make transaction agent");
    let tailURL = "beta/makeTransaction";
    console.log("add", tailURL);
    return api.post(tailURL, {
      userId,
      remark,
      type,
      amount
    }).then(response => {
      return response;
    });
  }

  // blockUnblockMarket(sportType, state) {
  //   console.log("block unblock market");
  //   let tailURL = "beta/blockSport";
  //   if (state)
  //     tailURL = "beta/unblockSport";
  //   console.log("block unblock", tailURL);
  //   return api.get(tailURL, {
  //     sportType
  //   }).then(response => {
  //     return response;
  //   });
  // }

  updateGlobalProperty(key, value) {
    console.log("update global property");
    let tailURL = "alpha/addGlobalProperty?key=" + key + "&value=" + value;
    console.log("add", tailURL);
    return api.post(tailURL, {
    }).then(response => {
      return response;
    });
  }

  changePassword(oldPassword, newPassword, userId, role) {
    // return api.post("rest/v1/changePassword", {
    console.log("setFirstPassword", userId, oldPassword, newPassword);
    return api.post("login/beta/setFirstPassword", {
      userId,
      oldPassword,
      newPassword,
    }, { role }).then((response) => {
      console.log("cp resp", response);
      TokenService.setUser(response.data);

      return response;
    });
  };

  changePasswordProfile(oldPassword, newPassword, role) {
    let tailURL = "login/beta/changePassword";
    return api.post(tailURL, {
      oldPassword,
      newPassword
    }, { role }).then((response) => {
      console.log("cp profile resp", response);
      // TokenService.setUser(response.data, role);

      return response;
    });
  };

  changeUserPassword(userId, myPassword, password, entityType, role) {
    return api.post("beta/updateSubEntity", {
      userId,
      myPassword,
      password,
      entityType
    }, { role }).then((response) => {
      console.log("cupwd resp", response);
      // TokenService.setUser(response.data, response.data.agentType);

      return response;
    });
  };

  block = (userName, accountStatus, password, role) => {
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

    return api.post(tailURL, {
      userName,
      password
    }).then((response) => {
      console.log("block resp", response)
      return response;
    });
  };

  overrideResult = (gameId, winner) => {
    const user = TokenService.getUser('admin');
    const adminName = user.userName;
    const tailURL = "alpha/override/result";

    return api.post(tailURL, {
      gameId,
      adminName,
      winner
    }).then((response) => {
      console.log("block resp", response)
      return response;
    });
  };

  settle(userName, upiId, amount, role) {
    let tailURL = "alpha/settleTransaction";
    if (role === "agent") {
      tailURL = "beta/settleTransaction";
    }
    console.log("settle", tailURL);
    return api.post(tailURL, {
      userName,
      upiId,
      amount
    }).then(response => {
      return response;
    });
  }

  approveRecharge(id, rechargeState, role) {
    let tailURL = "alpha/updateRechargeRequest";
    if (role === "agent") {
      tailURL = "beta/updateRechargeRequest";
    }
    console.log("approve recharge", tailURL);
    return api.post(tailURL, {
      id,
      rechargeState
    }).then(response => {
      return response;
    });
  }

  approveWithdraw(id, rechargeState, role, transactionNumber, message) {
    let tailURL = "alpha/updateWithdrawRequest";
    if (role === "agent") {
      tailURL = "beta/updateWithdrawRequest";
    }
    console.log("approve withdraw", tailURL);
    return api.post(tailURL, {
      id,
      rechargeState,
      transactionNumber,
      message
    }).then(response => {
      return response;
    });
  }

  addMyUpi(name, upi, description, password, image, role) {
    let tailURL = "alpha/addUpi";
    if (role === "agent") {
      tailURL = "beta/addUpi";
    }
    console.log("add upi", tailURL);
    return api.post(tailURL, {
      name,
      upi,
      description,
      password,
      image
    }).then(response => {
      return response;
    });
  }

  registerReferred(name, email, userName, agentCode, password, otp, tailURL) {

    console.log("add upi", tailURL);
    return api.post(tailURL, {
      name,
      email,
      userName,
      agentCode,
      password,
      otp
    }).then(response => {
      return response;
    });
  }

  deleteMyUpi(id, password, role) {
    let tailURL = "alpha/deleteUpi";
    if (role === "agent") {
      tailURL = "beta/deleteUpi";
    }
    console.log("delete upi", tailURL);
    return api.post(tailURL, {
      id,
      password
    }).then(response => {
      return response;
    });
  }

  notifyAllUsers(agentName, message, password, emailUser, role) {
    let tailURL = "alpha/notifyAllUsers"
    if (role === "agent") {
      tailURL = "beta/notifyAllUsers";
    }
    console.log("notify all users", tailURL);
    return api.post(tailURL, {
      agentName,
      message,
      emailUser,
      password
    }).then(response => {
      return response;
    });
  }

  notifyUser(agentName, userName, message, password, emailUser, role) {
    let tailURL = "alpha/notifyUser"
    if (role === "agent") {
      tailURL = "beta/notifyUser";
    }
    console.log("notify user", tailURL);
    return api.post(tailURL, {
      agentName,
      userName,
      message,
      emailUser,
      password
    }).then(response => {
      return response;
    });
  }

  //   getCurrentUser() {
  //     return TokenService.getUser();
  //   }
}

export default new AuthServices();