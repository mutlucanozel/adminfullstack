import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";
import Swal from "sweetalert2";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
  import 'react-toastify/dist/ReactToastify.css';
  
function Login() {
  const [cookies] = useCookies([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (cookies.jwt) {
      navigate("/");
      removeCookie("jwt");
    }
  }, [cookies, navigate]);


  const [values, setValues] = useState({ email: "", password: "" });
  const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });
    const [showAlert, setShowAlert] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5001/login",
        {
          ...values,
        },
        { withCredentials: true }
        
      );
      
      if (data) {
        if (data.errors) {
          const { email, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Login successful',
            showConfirmButton: false,
            timer: 3500
          })
          
          toast.success(`W E L C O M E    ${values.email}   `, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            
          }
          );
          navigate("/");
          removeCookie("jwt");
          
        }
      }
    } catch (ex) {
      console.log(ex);
    }
    setShowAlert(true);
  };
  return (
    <Container>
            
       <Logo>
        <img src="https://i.ibb.co/vx8ZZNx/purple-user-protection-icon-isolated-background-secure-login-password-protected-personal-data-authen.jpg" alt="" />
    </Logo>
    
        <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <label htmlFor="email"></label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="password"></label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
        <button type="submit">Login</button>

        <span>
           <Link to="/register"> <h2>
          Don't have an account ? </h2>  </Link>
        </span>
      </form>
      
      <ToastContainer />
   </Container>
  );
}

const Container = styled.div`
width: 20%;
  border: 1px solid #f3b414;
  min-width: 60px;
  height: 470px;
  padding: 5px;
  margin-top: 220px;
  margin-left: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.div`
  width: 260px;
  margin-top: -120px;
  img {
    width: 100%;
  }
`;
const InfoText = styled.p`
  font-size: 44px;
  width: 50%;
  word-wrap: normal;
  word-break: normal;
  margin-top: 20px;
  span {
    color: #426bc0;
  }
`;


const FormContainer = styled.form`
  border: 1px solid #f3b414;
  width: 55%;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  h3 {
    font-size: 28px;
    font-weight: 400;
    line-height: 33px;
    align-self: flex-start;
    margin-bottom: 10px;
  }
`;

const InputContainer = styled.div`
  width: 100%;
  padding: 10px;
  p {
    font-size: 14px;
    font-weight: 600;
  }
  input {
    width: 95%;
    height: 33px;
    padding-left: 5px;
    border-radius: 5px;
    border: 1px solid lightgray;
    margin-top: 5px;
    &:hover {
      border: 1px solid orange;
    }
  }
`;


const LoginButton = styled.button`
  background-color: #f3b414;
  border-radius: 10px;
  width: 90%;
  height: 35px;
  font-size: 12px;
  margin-top: 20px;
  &:hover {
    background-color: #dfdfdf;
  
`;



const SignUpButton = styled.button`
  width: 65%;
  height: 35px;
  background-color: #f3b414;
  font-size: 12px;
  border: 2px solid #f3b414;
  border-radius: 10px;
  margin-top: 20px;
  margin-left: -20px
  &:hover {
    background-color: #dfdfdf;
    border: 1px solid gray;
  }
`;
export default Login;