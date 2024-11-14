import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify";

interface Product {
  _id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  isVerified: boolean;
  published: boolean;
  image?: string;
  email?: string;
  phone_number?: string;
  address?: string;
}

const Admin_Verifying_Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem("token");
  const apiUrl = "https://user-product-api-nb1x.onrender.com/api/admin"; 

 
  const columns: GridColDef[] = [
    { field: "image", headerName: "Image", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "price", headerName: "Price", type: "number", flex: 1 },
    { field: "rating", headerName: "Rating", type: "number", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleVerifyProduct(params.row._id)}
          >
            Verify
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "red", color: "white", "&:hover": { backgroundColor: "darkred" } }}
            onClick={() => handleRejectProduct(params.row._id)}
          >
            Reject
          </Button>
        </Box>
      ),
    },
  ];

  // Fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/verfyingproducts/`, {
        headers: {
          Authorization: token,
        },
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleVerifyProduct = async (productId: number) => {
    try {
      const response = await axios.put(
        `${apiUrl}/verify-product/${productId}`,
        {isVerified: true},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("Product verified:", response.data.data);
      fetchProducts();
      toast.success("Product successfully verified!");
    } catch (error) {
      // fetchProducts();
      console.error("Error verifying product:", error);
      toast.error("Failed to verify product.");
    }
  };

    // Function to handle rejecting the product
    const handleRejectProduct = async (Id: string) => {
      setLoading(true); 
      try {
        const response = await axios.delete(
          `https://user-product-api-nb1x.onrender.com/api/partner/delete-product/${Id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("Product rejected:", response.data);
        fetchProducts();
        toast.success("Product rejected!");
      } catch (error) {
        console.error("Error rejecting product:", error);
        toast.error("Failed to reject product.");

      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="card shadow border-0 p-3 mt-5 m-4" style={{ marginTop: "20px" }}>
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
          <DataGrid
            rows={products}
            columns={columns}
            // checkboxSelection
            getRowId={(row) => row._id}
            loading={loading}

          />
        </Box>
      </Box>
    </div>
  );
};

export default Admin_Verifying_Products;

























// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Box, Button, CircularProgress, TextField } from "@mui/material";
// import { DataGrid, GridColDef } from "@mui/x-data-grid";

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   rating: number;
//   published: boolean;
//   image?: string;
// }

// const Admin_Verifyed_Products = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const token = localStorage.getItem("token");
//   const apiUrl = "https://user-product-api-nb1x.onrender.com/api/admin";
//   const imageBaseUrl = "https://user-product-api-nb1x.onrender.com"; 

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.PUT(`${apiUrl}/api/admin/verifyProduct/`, {
//         headers: {
//           Authorization: token,
//         },
//       });
//       setProducts(response.data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const columns: GridColDef<Product>[] = [
//     // { field: "image", headerName: "Image", width: 70 },
//     {
//       field: "image",
//       headerName: "Image",
//       width: 70,
//       renderCell: (params) => (
//         <img
//           src={params.value ? `${imageBaseUrl}/${params.value}` : ""}
//           alt="Product"
//           style={{ width: "50px", height: "50px", borderRadius: "5px", objectFit: "cover" }}
//         />
//       ),
//     },
//     { field: "name", headerName: "Name", flex: 1 },
//     { field: "description", headerName: "Description", flex: 1 },
//     { field: "price", headerName: "Price", type: "number", flex: 1 },
//     { field: "rating", headerName: "Rating", type: "number", flex: 1 },
//   ];
//   return (
//     <div className="card shadow border-0 p-3 mt-5 m-4" style={{ marginTop: "20px", height: "85vh" }}>
//       <Box m="20px">
//         <Box display="flex" alignItems="center" mb={2} justifyContent="space-between">
//           <Box>
//             <TextField
//               variant="outlined"
//               label="Search Products"
//               sx={{ marginRight: "8px" }}
//             />
//             <Button variant="contained" color="primary" style={{ height: "6vh" }}>
//               Search
//             </Button>
//           </Box>
//         </Box>
//          <Box mt={3} sx={{ height: 400, width: "100%" }}>
//           {loading ? (
//             <Box display="flex" justifyContent="center" alignItems="center" style={{ height: "70vh" }}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <DataGrid style={{ height: "70vh" }} 
//             rows={products}
//             columns={columns}
//             checkboxSelection
//             getRowId={(row) => row._id} />
//           )}
//         </Box>
//       </Box>
//     </div>
//   );
// };

// export default Admin_Verifyed_Products;