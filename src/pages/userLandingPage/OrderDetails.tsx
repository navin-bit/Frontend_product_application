import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

// Define interfaces
interface Address {
  street: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

interface Item {
  name: string;
  price: number;
  image: {
    image: string;
  };
  qty: number;
}

interface Product {
  address: Address;
  items: Item[];
  totalPrice: number;
}

interface Order {
  orderCancel: boolean;
  _id: string;
  products: Product[];
  customer_id: string;
  address_id: Address;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxWidth: 800,
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  marginTop: theme.spacing(4),
}));

const StyledTableHead = styled(TableHead)({
  backgroundColor: "#1976d2",
});

const StyledTableCell = styled(TableCell)({
  color: "#fff",
  fontWeight: "bold",
});

const OrderDetails = () => {
  const [OrderDetails, setOrderDetails] = useState<Order[]>([]);

  const getAllOrderDetails = async () => {
    const response = await axios.get(
      "https://user-product-api-nb1x.onrender.com/api/customer/order-details",
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );

    setOrderDetails(response.data.getAllOrderDetails);
  };

  useEffect(() => {
    getAllOrderDetails();
  }, []);

  console.log("orders", OrderDetails);

  return (
    <>
      <Box display="flex" justifyContent="center" padding={2}>
        <StyledTableContainer>
          <Table>
            <h1>Order Details</h1>
            <TableBody>
              {OrderDetails.map((order) => {
                return order.products.map((product, index) => (
                  <TableRow>
                    {product.items.map((item, i) => (
                      <TableRow key={`${order._id}-${index}-${i}`} hover>
                        <TableCell>{order._id}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar
                              src={item.image.image}
                              alt={item.name}
                              variant="rounded"
                              sx={{ width: 50, height: 50, marginRight: 2 }}
                            />
                            <Typography variant="body1">
                              Name {item.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>Price {item.price}</TableCell>
                        <TableCell>Quantity {item.qty}</TableCell>
                      </TableRow>
                    ))}

                    <TableCell>Total Price {product.totalPrice}</TableCell>
                  </TableRow>
                ));
              })}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Box>
    </>
  );
};

export default OrderDetails;
