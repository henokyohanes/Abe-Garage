import React, { useState } from "react";
import Layout from "../../Layout/Layout";
import Signup from "../../Components/SignUp/SignUp";
import Login from "../../Components/Login/Login";
import NotFound from "../../Components/NotFound/NotFound";
import styles from "./Auth.module.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(false);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Layout>
      {!error ? (<div className={styles.authContainer}>
            {isLogin ? (
              <Login onToggle={handleToggle} setError={setError} />
            ) : (
              <Signup onToggle={handleToggle} setError={setError} />
            )}
      </div>) : <NotFound />}
    </Layout>
  );
}

export default Auth;