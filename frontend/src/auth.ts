import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "eu-central-1_wbicJv3W3", //cf output einfügen
  ClientId: "49fmlkpn2urofbnebokhvvmb02", //cf output einfügen
};

const userPool = new CognitoUserPool(poolData);

export function login(
  username: string,
  password: string
): Promise<CognitoUserSession> {
  const authDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
    });
  });
}

export function getAccessToken(): Promise<string | null> {
  return new Promise((resolve) => {
    const currentUser = userPool.getCurrentUser();
    if (!currentUser) return resolve(null);

    currentUser.getSession((err, session) => {
      if (err || !session) return resolve(null);
      resolve(session.getAccessToken().getJwtToken());
    });
  });
}
