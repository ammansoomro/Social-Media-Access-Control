// IMPORTS ===================================
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import wave from "../assets/wave.png";
import login from "../assets/login_logo.svg";
import avatar from "../assets/login_avatar.svg";
import { HiOutlineMail } from 'react-icons/hi'
import { RiLockPasswordLine } from "react-icons/ri";
import styled from "styled-components";
import { UserContext } from "../App";
import { createGlobalStyle } from "styled-components";
import swal from 'sweetalert';
// IMPORT END ===================================

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch } = useContext(UserContext);

  const NavigateToSignup = () => {
    navigate("/signup");
  };

  const LoginUser = async (e) => {
    e.preventDefault();
    console.log("LOGGING IN");
    const res = await fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();
    if (res.status === 400 || !data) {
      // Make input fields red
      swal({
        title: "Invalid Credentials!",
        text: "Kindly enter correct Email and Password",
        icon: "error",
        button: false,
        timer: 1800
      })     } else {
      dispatch({ type: "USER", payload: true });
      // window.alert("Login Successful");
      // Set Email and Password to empty strings
      setEmail("");
      setPassword("");
      // Navigate to Home Page
      navigate("/");
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wave src={wave} alt="Wave" />
      {/* Use SVG */}
      <Container>
        <Image >
          <img src={login} alt="login" />
        </Image>
        <LoginContent>
          <Form id="login-form" onSubmit={handleSubmit}>
            <img className="avatar" src={avatar} alt="avatar" />
            <div className="input-div">
              <Myinput>
                <Icon className="i">
                  <HiOutlineMail />
                </Icon>
                <Wrapper>
                  <Input
                    type="username" required value={username} onChange={(e) => setUsername(e.target.value)}
                  />
                  <Validation>* Email Invalid</Validation>
                </Wrapper>

              </Myinput>
              <Myinput>
                <Icon className="i">
                  <RiLockPasswordLine />
                </Icon>
                <Wrapper>
                  <Input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  />
                </Wrapper>
              </Myinput>
              <Btn
                type="submit"
                value="Login"
              />
              <Btn
                type="submit"
                value="Sign Up"
              />
            </div>
          </Form>
        </LoginContent>
      </Container>
    </>
  );
};

export default Signin;


const GlobalStyle = createGlobalStyle`
  body {
    background: #0a4e33ed;
  }
`;

const Validation = styled.div`
  /* Style One */
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translate(5rem, -50%);
  opacity: 0;
  color: #f9f9f9;
  transition: all 0.35ms;
  font-size: 0.6rem;
`;

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
`;
const Wave = styled.img`
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100%;
  z-index: -1;

  @media screen and (max-width: 900px) {
    display: none;
  }
`;

const Myinput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  position: relative;
  height: 45px;
  margin: 50px 0;
`;

const Btn = styled.input`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  width: 100%;
  height: 3rem;
  border-radius: 2rem;
  background: #2fd09b;
  font-size: 1.2rem;
  color: #fff;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  margin: 2rem 0;
  cursor: pointer;
  transition: ease-in-out 0.5s;
  font-weight: bold;
  border: none;

  &:hover {
    border: 3px solid #38d39f;
    color: #38d39f;
    background: transparent;
    transform: translateY(-0.8rem);
  }
`;

const Input = styled.input`
  transition: ease-in-out 0.3s;
  top: 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 0.5rem 0.7rem;
  font-size: 1.2rem;
  color: ghostwhite;
  font-family: "poppins", sans-serif;
  border-bottom: 2px solid #26d69b80;
  

  &:valid {
    border-color: #55d688;}

  &:invalid {
    border-color: #fd4444;}
  
  &:invalid ~ ${Validation} {
    opacity: 1;
    transform: translate(0, -50%);}
  /* Focus */
  &:focus {
    transition: 0.5s;
    border-bottom: 2px solid #24d59afa;
  }

  /* Input Focus Placeholder */
  &:focus::placeholder {
    color: transparent;
  }

  &::placeholder {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #fafafa;
    font-size: 18px;
    transition: 0.3s;
  }
`;


const Container = styled.div`
  /* width: 100vw; */
  height: 92vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15rem;
  padding: 0 2rem;
  @media screen and (max-width: 1050px) {
    grid-gap: 5rem;
  }

  @media screen and (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Image = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  img {
    width: 480px;
	/* width: 500px; */
  }

  @media screen and (max-width: 900px) {
    display: none;
  }

  @media screen and (max-width: 1000px) {
    img {
      width: 400px;
    }
  }
`;

const LoginContent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
  /* padding: 5rem; */
  img {
    height: 120px;
  }

  h2 {
    margin: 15px 0;
    color: #333;
    text-transform: uppercase;
    font-size: 2.9rem;
  }

  @media screen and (max-width: 900px) {
    justify-content: center;
  }

  @media screen and (max-width: 1000px) {
    h2 {
      font-size: 2.4rem;
      margin: 8px 0;
    }
  }
`;

const Form = styled.form`
  width: 360px;
  @media screen and (max-width: 1000px) {
    width: 290px;
  }
`;

const Icon = styled.div`
  color: #79847d;
  display: flex;
  justify-content: center;
  align-items: center;
`;
