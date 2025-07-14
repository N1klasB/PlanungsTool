import { useEffect } from "react";

const LoginRedirect = () => {
  useEffect(() => {
    window.location.href =
      "https://ni-beh-app-login.auth.eu-central-1.amazoncognito.com/login?response_type=token&client_id=49fmlkpn2urofbnebokhvvmb02&redirect_uri=http://localhost:3000/callback";
  }, []);

  return null;
};

export default LoginRedirect;
