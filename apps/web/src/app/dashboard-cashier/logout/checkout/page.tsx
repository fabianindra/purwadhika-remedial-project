'use client';
import { useState, useEffect } from 'react';
import { Box, Text, Input, Button, FormControl, FormLabel, VStack, Flex } from "@chakra-ui/react";
import Cookies from 'js-cookie';
import { CheckOut } from '@/api/shift';
import { jwtDecode } from 'jwt-decode';
import Nav from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const CheckOutPage = () => {
  const [cashAmount, setCashAmount] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [shiftId, setShiftId] = useState<number | null>(null);
  const token = Cookies.get('token');
  const shift = Cookies.get('shift');

  useEffect(() => {
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
        setUserId(decodedToken.userid);
      } catch (e) {
        console.error('Failed to decode token:', e);
        setError('Invalid token');
      }
    }
  }, [token]);

  useEffect(() => {
    if (shift) {
      try {
        const decodedShift: any = jwtDecode(shift);
        setShiftId(decodedShift.shiftId);
      } catch (e) {
        console.error('Failed to decode shift:', e);
        setError('Invalid shift');
      }
    }
  }, [shift]);

  const handleCashAmountSubmit = async () => {
    const confirmation = window.confirm("Are you sure you want to submit this cash amount?");
    if (!confirmation) {
      return;
    }

    try {
      if (userId !== null && shiftId !== null) {
        const response = await CheckOut(cashAmount, userId, shiftId);

        if (response.status === 201) {
            Cookies.remove('token');
            window.location.href = '/';
        } else {
          setError('Failed to submit cash amount');
          window.location.href = '/dashboard-cashier/products';
        }
      }
    } catch (error: any) {
      console.error('API call error:', error);
      setError(error.response?.data?.message || 'Failed to submit cash amount');
      window.location.href = '/dashboard-cashier/products';
    }
  };

  const handleBack = () => {
    window.location.href = '/dashboard-cashier/products';
  };

  return (
    <Flex direction="column" minHeight="100vh">
    <Nav />
    <Flex flex="1" alignItems="center" justifyContent="center">
      <Box p={4} maxWidth="300px" width="full" color="primary">
        <VStack spacing={3}>
          {error && <Text color="red.300" fontSize="xs">{error}</Text>}
          <FormControl id="cashAmount">
            <FormLabel fontSize="xs" color="black">Cash Amount</FormLabel>
            <Input
              type="text"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              bg="white"
              color="black"
              fontSize="xs"
              borderRadius="md"
              placeholder="Enter cash amount"
              size="sm"
            />
          </FormControl>
          <Button mt={6} fontSize="xs" width="full" bgColor="tertiary" onClick={handleCashAmountSubmit}>
            Submit
          </Button>
        </VStack>
        <Button mt={6} fontSize="xs" width="full" bgColor="secondary" onClick={handleBack}>
            Back to Dashboard
          </Button>
      </Box>
      </Flex>
      <Footer />
    </Flex>
  );
};

export default CheckOutPage;
