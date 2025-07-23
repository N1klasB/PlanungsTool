import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../config.ts";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));

    const accessToken = params.get("access_token");
    const idToken = params.get("id_token");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("id_token", idToken ?? "");
    }

    const loadData = async () => {
      try {
        const response = await fetch(
          config.APIURL+"/load",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem(
            "loaded_tasks",
            JSON.stringify(data.tasks ?? [])
          );
          localStorage.setItem(
            "loaded_projects",
            JSON.stringify(data.projects ?? [])
          );
        } else {
          console.error("Load failed:", await response.text());
        }
      } catch (err) {
        console.error("Error during load:", err);
      }
    };

    const run = async () => {
      if (idToken) {
        await loadData();
      }
      navigate("/Dashboard");
    };

    run();
  }, [navigate]);

  return null;
};

export default Callback;
