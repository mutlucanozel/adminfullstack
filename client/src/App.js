import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import styled from "styled-components";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Products from "scenes/products";
import Customers from "scenes/customers";
import Transactions from "scenes/transactions";
import Geography from "scenes/geography";
import Overview from "scenes/overview";
import Daily from "scenes/daily";
import Login from "./components/Login";
import Register from "./components/Register";
import Monthly from "scenes/monthly";
import Breakdown from "scenes/breakdown";
import Admin from "scenes/admin";
import Performance from "scenes/performance";
import Addproduct from "scenes/addproduct";
import Cards from "./components/Cards";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  
  
  return (
    
    <div className="app">
      <BrowserRouter>
     
        <ThemeProvider theme={theme}>
         
          <CssBaseline />
        
            <Routes>
              
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/login" element={<Login />} />
          
              <Route element={<Layout />}>
              <Route exact path="/dashboard" element={<Dashboard />} />
              <Route exact path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/addproduct" element={<Addproduct />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/performance" element={<Performance />} />
         
              
            </Route>
          </Routes>

          <ToastContainer/>
        </ThemeProvider>
       
      </BrowserRouter>
    </div>
  );
}
const Container = styled.div;
export default App;
