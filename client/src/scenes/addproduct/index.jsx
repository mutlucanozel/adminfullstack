import axios from "../axios";
import swal from "sweetalert2";
import Header from "components/Header";
import React, { useState } from "react";
import Styled from "styled-components";
import { useEffect } from "react";
import Alert from '@mui/material/Alert';
import { Link, useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Swal  from "sweetalert2";
import FlexBetween from "components/FlexBetween";
import "../addproduct/stlyes.module.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import StatBox from "components/StatBox";
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

function AddProduct() {

  const [image, setImage] = useState();
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [description, setDescription] = useState("");
  const [Km, setKm] = useState();
  const [phoneno, setphoneno] = useState();
  const [url, setUrl] = useState();
  const [modelyear, setModelyear] = useState();
  const [category, setCategory] = useState("");
  

  
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
  
 
  
  if (!category || !price || !modelyear|| !Km || !description ||!name || !phoneno){
        Swal.fire({
          icon: 'info',
          title: 'Please Fill in all the blanks.',
          text: 'Something went wrong!',
        })
      }
      else {
    try {
      e.preventDefault();
      Swal.showLoading()	
      const data = new FormData()
      data.append("file",image)
      data.append("upload_preset","mcan-clone")
      data.append("cloud_name","mcancloudinary")
      const res = await fetch("https://api.cloudinary.com/v1_1/mcancloudinary/image/upload",{
          method:"post",
          body:data
      })
      const cloudinaryData = await res.json();
      const imageUrl = cloudinaryData.url;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("Km", Km);
      formData.append("phoneno", phoneno)
      formData.append("modelyear", modelyear);
      formData.append("category", category);
      formData.append("image", imageUrl);
    
      await axios.post("/products/add", formData);
     
      await Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'The product has been successfully added.',
          text: 'You are redirected to the products page.',
          showConfirmButton: false,
          timer: 2500
       
      }) 
      
      navigate('/products');
      window.location.reload();
 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<a href="">Why do I have this issue?</a>'
      })
    }

  };

} 

  return (
    <Container>


      <FormContainer>
      <Logo>
        <img src="https://i.ibb.co/q1fKKp8/premium-quality-best-seller-gold-logo-badge-design-template-8e1c771c9ad5d44dda615f0801aa1c18-removeb.jpg" alt="" />
    </Logo>

   
        <InputContainer>
          
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          
        </InputContainer>

       

        <InputContainer>
     
          <input
            type="number"
            placeholder="Price"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />
        </InputContainer>
        <InputContainer>
       
          <input
            type="number"
            placeholder="Model year"
            onChange={(e) => setModelyear(e.target.value)}
            value={modelyear}
          />
        </InputContainer>

  
        
      <InputContainer>
          <input
            type="number"
            placeholder="Km"
            onChange={(e) => setKm(e.target.value)}
            value={Km}
          />
     </InputContainer>
        

     <InputContainer>
   
          <input
            type="text"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          
          </InputContainer>
          <InputContainer>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              
            >
              <option value="Tractor">Tractor</option>
              <option value="Car">Car</option>
              <option value="Motorcycle">Motorcycle</option>
              {/* add more options here */}
            </select>
          </InputContainer>
                <InputContainer>
  <input
    type="Number"
    placeholder="PhoneNo"
    onChange={(e) => setphoneno(e.target.value)}
    value={phoneno}
  />
</InputContainer>

      <ThemeProvider theme={themecolor}>
     
     
  
      <InputContainer><input name="photo" type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleImageChange} /></InputContainer>

        <Button variant="outlined" size="large" color="neutral" endIcon={<LocalOfferRoundedIcon />} onClick={handleSubmit}>Add Product</Button>
        </ThemeProvider>
        <ToastContainer/>
      </FormContainer>
    </Container>
  );
}

const Container = Styled.div`
  width: 40%;
  min-width: 750px;
  height: fit-content;
  padding: 40px;
  margin-left: 350px;
  margin-top: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = Styled.div`
  width: 180px;
  margin-top -70px;
  img {
    width: 100%;
  }
`;

const themecolor = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#0971f1',
      darker: '#053e85',
    },
    neutral: {
      main: '#f3b414',
      contrastText: '#053e85',
      
    },
  },
});

const FormContainer = Styled.form`
  border: 1.2px solid white;
  width: 65%;
  height: 910px;
  margin-top: -50px;
  display: flex;
  border-radius: 25px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;

  h3 {
    font-size: 18px;
    font-weight: 400;
    line-height: 33px;
    align-self: flex-start;
    color: #f3b414
    margin-bottom: 10px;
  }
`;

const InputContainer = Styled.div`
  width: 100%;
  padding: 10px;
 
  
  p {
    font-size: 14px;
    font-weight: 600;
  }

  input {
    backgroundcolor: transparent;
    width: 95%;
    height: 43px;
    padding-left: 5px;
    border-radius: 7px;
    color: white;
    border: 1.6px solid white;
    margin-bottom: 0px;

    &:hover {
      border: 1px solid #f3b414;
    }
  }
`;

const DescInputContainer = Styled.div`
  width: 100%;
  padding: 10px;
  
  p {
    font-size: 14px;
    font-weight: 60;
  }

  input {
    width: 95%;
    height: 73px;
    padding-left: 5px;
    backgroundcolor: white;
    color: white;
    border-radius: 7px;
    border: 1.6px solid white ;
    margin-top: 5px;

    &:hover {
      border: 1px solid #f3b414;
    }
  }
`;

/*const Button = styled.button`
background: transparent;
border-radius: 2px;
border: 1.2px solid #f3b414;
color: #f3b414;
margin: 1em 2em;
padding: 0.25em 1em;
`;*/

export default AddProduct;