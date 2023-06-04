import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardActions,
  Button,
  CardContent,
  Collapse,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "components/Header";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useGetProductsQuery } from "state/api";
import DeleteIcon from '@mui/icons-material/Delete';
import { Delete } from "@mui/icons-material";


const Product = ({
  _id,
  name,
  description,
  price,
  Km,
  image,
  category,
  modelyear,
  stat,
 
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const deleteProduct = (id, name) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          ` ${name} has been deleted.`,
          'success',
         
        ).then(() => {
          fetch("http://localhost:5001/products/delete", {
            method: "POST",
            crossDomain: true,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              productid: id,
            }),
          })
          .then((res) => res.json())
          .then((data) => {
            alert(data.data);
           
          })
          history.go(0);
          ;
        });
        
      }
    
    });
    
  };
  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "1.15rem",
      }}
    >
  <CardContent>
      <Typography sx={{ fontSize: 28 }} component="div"  style={{ textAlign: 'center' , fontFamily: 'Copperplate, sans-serif'}}>
          {name}  
          </Typography>
        <Typography
         
          style={{ textAlign: 'center',fontFamily: 'Copperplate, sans-serif' }}
          color={theme.palette.secondary[700]}
          gutterBottom
          
        >
          {category}
        </Typography>
        
    
<Typography>
  <img src={image} alt="product image" style={{ borderRadius: '10px', width: '320px', height: 'auto' }} />

        </Typography>
        <Typography
  style={{
    textAlign: 'center',
    fontFamily: 'Copperplate, sans-serif',
    fontSize: '1.2rem',
  }}
  sx={{ mb: '1.5rem' }}
  color={'white'}
>
  Price:{' '}
  {Number(price).toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  })}{' '}
  ₺
</Typography>
        
 
        
         
         <Typography style={{ textAlign: 'center',fontFamily: 'Copperplate, sans-serif',fontSize: '1.2rem', }} sx={{ mb: "1.5rem" }} color={"white"}>Model year: {modelyear}</Typography>
       
         <Typography style={{ textAlign: 'center',fontFamily: 'Copperplate, sans-serif',fontSize: '1.2rem', }} sx={{ mb: "1.5rem" }} color={"white"}>
         Km: {Number(Km).toLocaleString('tr-TR')}
           
          </Typography>
         </CardContent>
      <CardActions>
        <Button
          style={{ marginLeft: '10px',color:'#FEE3A3' ,marginBottom: '20px' ,lineHeight: 1.5,fontFamily: "Segoe UI Emoji",}}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          Description
        </Button>
        <Button style={{ marginLeft: '120px' ,marginBottom: '20px' ,border: '3px solid',borderColor: '#FEE3A3', backgroundColor: '#FEE3A3',lineHeight: 1.5,fontFamily: "Segoe UI Emoji",}} onClick={() => deleteProduct(_id, name)} startIcon={<DeleteIcon />}>  Delete
</Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
         
        <Typography   style={{ textAlign: 'center',fontFamily: 'Copperplate, sans-serif', fontSize: '1.2rem',  }} variant="body2">{description}</Typography>
        <Typography  style={{ textAlign: 'right', fontSize: '0.7rem', color: 'green'  }} > {_id}</Typography>
        </CardContent>
      </Collapse>
    </Card>

  );
};

const Products = () => {
  const { data, isLoading } = useGetProductsQuery();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PRODUCTS" subtitle="See your list of products." />
      {data || !isLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {data.map(
            ({
              _id,
              name,
              description,
              price,
              Km,
              image,
              category,
              modelyear,
              stat,
            }) => (
              <Product
                key={_id}
                _id={_id}
                name={name}
                description={description}
                price={price}
                Km={Km}
                image={image}
                category={category}
                modelyear={modelyear}
                stat={stat}
                
              />
            )
          )}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Products;
