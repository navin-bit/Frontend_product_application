import React, { useState } from 'react';
import { Box, Typography, IconButton, Divider, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller } from 'react-hook-form';
import { useCart } from '../../context_API/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShoppingCart = () => {
  const { cart, removeFromCart } = useCart();
  const totalPrice = cart.reduce((total, item) => total + item.price, 0); 
  const [open, setOpen] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange"
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data:any) => {
    const addressData = {
      street: data.street,
      city: data.city,
      state: data.state,
      pinCode: data.pincode,
      country: data.country
    };
    const orderData = [{
      address: addressData,
      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
        image: item.image,
      })),
      totalPrice, 
    }];

    try {
      const addressResponse = await fetch('https://user-product-api-nb1x.onrender.com/api/customer/add-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(addressData),
      });

      if (!addressResponse.ok) throw new Error('Failed to add address.');

    
      const purchaseResponse = await fetch('https://user-product-api-nb1x.onrender.com/api/customer/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({products:orderData}),
      });

      if (!purchaseResponse.ok) throw new Error('Failed to place order.');

      toast.success("Order placed successfully!");
      handleClose(); 
      // reset();
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Failed to place order.");
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      {cart.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          Your cart is empty.
        </Typography>
      ) : (
        <>
          {cart.map((product) => (
            <Box key={product._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <Box
                component="img"
                src={`${product.image.image}`}
                alt={product.name}
                width="50"
                height="70"
                sx={{ borderRadius: '10px', width: 80, height: 100, objectFit:"contain" }}
                
              />
              <Box sx={{ flexGrow: 1, marginLeft: '20px' }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="subtitle1">Price: ₹{product.price.toFixed(2)}</Typography>
              </Box>
              <IconButton onClick={() => removeFromCart(product._id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <Typography variant="h5">Total: ₹{totalPrice.toFixed(2)}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
              Checkout
            </Button>
          </Box>
        </>
      )}

      <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { width: '600px' } }}>
        <DialogTitle>Fill the Address For the Order</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ marginBottom: 2 }}>
              <Controller
                name="street"
                control={control}
                defaultValue=""
                rules={{ required: 'Street is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Street"
                    variant="outlined"
                    fullWidth
                    error={!!errors.street}
                    sx={{ marginBottom: 2 }}
                  />
                )}
              />
            </Box>

            <Box sx={{ marginBottom: 2 }}>
              <Controller
                name="city"
                control={control}
                defaultValue=""
                rules={{ required: 'City is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="City"
                    variant="outlined"
                    fullWidth
                    error={!!errors.city}
                    sx={{ marginBottom: 2 }}
                  />
                )}
              />
            </Box>

            <Box sx={{ marginBottom: 2 }}>
              <Controller
                name="state"
                control={control}
                defaultValue=""
                rules={{ required: 'State is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="State"
                    variant="outlined"
                    fullWidth
                    error={!!errors.state}
                    sx={{ marginBottom: 2 }}
                  />
                )}
              />
            </Box>

            <Box sx={{ marginBottom: 2 }}>
              <Controller
                name="pincode"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Pin code is required',
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Pin code must be exactly 6 digits"
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Pin Code"
                    variant="outlined"
                    fullWidth
                    type="tel"
                    error={!!errors.pincode}
                    sx={{ marginBottom: 2 }}
                  />
                )}
              />
            </Box>

            <Box sx={{ marginBottom: 2 }}>
              <Controller
                name="country"
                control={control}
                defaultValue=""
                rules={{ required: 'Country is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Country"
                    variant="outlined"
                    fullWidth
                    error={!!errors.country}
                    sx={{ marginBottom: 2 }}
                  />
                )}
              />
            </Box>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit Order
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ShoppingCart;
