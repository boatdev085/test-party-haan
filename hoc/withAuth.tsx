import React, { useEffect, useState } from "react";
import Router from "next/router";
import JWT from "jsonwebtoken";
import Config from "config/config";
const withAuth = (Components) => (props) => {
  const [useRender, setRender] = useState(false);
  const handleJWT = async () => {
    const getToken = localStorage.getItem("token");
    if (!getToken) {
      Router.push("/login");
      return;
    }
    const decoded = JWT.verify(getToken, Config.secret_key);
    if (!decoded) {
      Router.push("/login");
      return;
    }
    setRender(true);
  };
  useEffect(() => {
    handleJWT();
  }, []);
  if (!useRender) return null;
  return <Components {...props} />;
};

export default withAuth;
