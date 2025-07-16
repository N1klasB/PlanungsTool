import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { config } from "./config.ts";

const poolData = {
  UserPoolId: config.USERPOOLID,
  ClientId: config.USERPOOLCLIENTID,
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

export function getIdToken(): string | null {
  return localStorage.getItem("id_token") || null;
}

export function getUsernameFromToken(): string | null {
  const token = localStorage.getItem("id_token") || "";
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload["cognito:username"] || null;
  } catch {
    return null;
  }
}
