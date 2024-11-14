import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  isActive: boolean;
  image?: string;
}

const Admin_verifyed_Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem("token");
  const apiUrl = "https://user-product-api-nb1x.onrender.com/api/admin";
  const imageBaseUrl = "https://user-product-api-nb1x.onrender.com"; 

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/verfiedproducts`, {
        headers: {
          Authorization: token,
        },
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns: GridColDef<Product>[] = [
    {
      field: "image",
      headerName: "Image",
      width: 70,
      renderCell: (params) => (
        <img
          src={params.value ? `${imageBaseUrl}/${params.value}` : ""}
          alt="Product"
          style={{ width: "50px", height: "50px", borderRadius: "5px", objectFit: "cover" }}
        />
      ),
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "price", headerName: "Price", type: "number", flex: 1 },
    { field: "rating", headerName: "Rating", type: "number", flex: 1 },
    {
      field: "isVerified",
      headerName: "Active",
      flex: 1,
      renderCell: (params) => (
        <span>{params.value ? "True" : "False"}</span>
      ),
    },

  ];
  return (
    <div className="card shadow border-0 p-3 mt-5 m-4" style={{ marginTop: "20px", height: "85vh" }}>
      <Box m="20px">
        <Box display="flex" alignItems="center" mb={2} justifyContent="space-between">
          <Box>
            <TextField
              variant="outlined"
              label="Search Products"
              sx={{ marginRight: "8px" }}
            />
            <Button variant="contained" color="primary" style={{ height: "6vh" }}>
              Search
            </Button>
          </Box>
        </Box>
         <Box mt={3} sx={{ height: 400, width: "100%" }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" style={{ height: "70vh" }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid style={{ height: "70vh" }} 
            rows={products}
            columns={columns}
            // checkboxSelection
            getRowId={(row) => row._id} />
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Admin_verifyed_Products;