import { useEffect } from "react";

const LoginRedirect = () => {
  useEffect(() => {
    window.location.href =
      "https://ni-beh-app-login.auth.eu-central-1.amazoncognito.com/login?response_type=token&client_id=u9srs5rqf4v24seogtbk5tepp&redirect_uri=http://localhost:3000/callback";
  }, []);

  return null;
};

export default LoginRedirect;
