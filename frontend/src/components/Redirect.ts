import { useEffect } from "react";

const LoginRedirect = () => {
  useEffect(() => {
    window.location.href =
      "https://ni-beh-app-login.auth.eu-central-1.amazoncognito.com/login?response_type=code&client_id=3av9r67jffrguhkrv7rilca3go&redirect_uri=https://planungs-tool.btc-ag.cloud/callback&scope=openid";
  }, []);

  return null;
};

export default LoginRedirect;
