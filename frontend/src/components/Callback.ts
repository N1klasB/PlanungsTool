import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../config.ts";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    console.log("Authorization Code:", code);

    if (!code) {
      console.error("No authorization code found in URL");
      navigate("/");
      return;
    }

    const exchangeCodeForTokens = async () => {
      try {
        const body = new URLSearchParams({
          grant_type: "authorization_code",
          client_id: config.USERPOOLCLIENTID,
          code,
          redirect_uri: config.CALLBACK_URL,
        });

        const tokenResponse = await fetch(`${config.COGNITO_DOMAIN}/oauth2/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        });

        if (!tokenResponse.ok) {
          const text = await tokenResponse.text();
          throw new Error(`Token request failed: ${text}`);
        }

        const data = await tokenResponse.json();

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("id_token", data.id_token);

        const loadResponse = await fetch(config.APIURL + "/load", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.id_token}`,
          },
        });

        if (loadResponse.ok) {
          const loadedData = await loadResponse.json();
          localStorage.setItem("loaded_tasks", JSON.stringify(loadedData.tasks ?? []));
          localStorage.setItem("loaded_projects", JSON.stringify(loadedData.projects ?? []));
          console.log("Loaded data:", loadedData);
        } else {
          console.error("Load failed:", await loadResponse.text());
        }

        navigate("/Dashboard");
      } catch (err) {
        console.error("Error during token exchange or data load:", err);
        navigate("/");
      }
    };

    exchangeCodeForTokens();
  }, [navigate]);

  return null;
};

export default Callback;
