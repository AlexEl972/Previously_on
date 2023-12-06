import React, { useState, useEffect } from "react";
import axios from "axios";

function OAuthPage() {
  const [authCode, setAuthCode] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const client_id = "bba558a60c3e";
  const client_secret = "ab16e5f148eac990e2e4efd566bb4566";
  const redirect_uri = "https://previously-on-deploy1.vercel.app/";

  useEffect(() => {
    const redirectToAuthorization = () => {
      window.location.href = `https://www.betaseries.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}`;
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      setAuthCode(code);
      const tokenParams = new URLSearchParams();
      tokenParams.append("client_id", client_id);
      tokenParams.append("client_secret", client_secret);
      tokenParams.append("redirect_uri", redirect_uri);
      tokenParams.append("code", code);
      axios
        .post("https://api.betaseries.com/oauth/access_token", tokenParams, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((response) => {
          const data = new URLSearchParams(response.data);
          const access_token = data.get("access_token");
          localStorage.setItem("token", access_token);
          
          setAccessToken(access_token);
        })
        .catch((error) => {
          console.error("Error fetching access token:", error);
        });
    } else {
      redirectToAuthorization();
    }
  }, [authCode]);

  return (
    <div>
      {accessToken ? (
        <div>
          <h2>Successfully Authenticated!</h2>
          <p>Access Token: {accessToken}</p>
        </div>
      ) : (
        <p>Authenticating...</p>
      )}
    </div>
  );
}

export default OAuthPage;
  