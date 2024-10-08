'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Button, HStack, Input, InputGroup, InputRightElement, Select, SimpleGrid, Table, Thead, Tbody, Tr, Th, Td, Text
} from '@chakra-ui/react';
import { MagnifyingGlass, SortAscending, SortDescending } from '@phosphor-icons/react/dist/ssr';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getTransactionAdmin } from '@/api/transaction';
import TransactionDetailModal from './TransactionDetailsModalAdmin';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TransactionReport = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>('transaction_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage] = useState<number>(8);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactionAdmin(startDate, endDate, category, sortBy, sortDirection);
        setTransactions(response.data.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [sortBy, sortDirection, startDate, endDate, category]);

  const handleSortDirection = () => {
    setSortDirection((prevDirection) =>
      prevDirection === 'asc' ? 'desc' : 'asc'
    );
  };

  const handleTransactionClick = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransactionId(null);
  };

  const formatToRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const chartData = {
    labels: transactions.map((transaction) =>
      new Date(transaction.transaction_date).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Grand Total',
        data: transactions.map((transaction) => transaction.grand_total),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Transactions Over Time',
      },
    },
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 5,
        bottom: 5,
      },
    },
  };
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = transactions.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(transactions.length / entriesPerPage);

  return (
    <Box mb={5} p={3} fontSize="sm">
      <HStack my={5} justifyContent="space-between" wrap="wrap">
        <InputGroup w={250} mb={3}>
          <Input
            type="date"
            placeholder="Start Date"
            onChange={(e) => setStartDate(e.target.value)}
            fontSize="sm"
          />
          <InputRightElement>
            <MagnifyingGlass size={16} />
          </InputRightElement>
        </InputGroup>
        <InputGroup w={250} mb={3}>
          <Input
            type="date"
            placeholder="End Date"
            onChange={(e) => setEndDate(e.target.value)}
            fontSize="sm"
          />
          <InputRightElement>
            <MagnifyingGlass size={16} />
          </InputRightElement>
        </InputGroup>
        <Select
          placeholder="Select Category"
          onChange={(e) => setCategory(e.target.value)}
          mb={3}
          w={250}
          fontSize="sm"
        >
          <option value="Coffee">Coffee</option>
          <option value="Non Coffee">Non Coffee</option>
          <option value="Pastry">Pastry</option>
        </Select>
        <HStack mb={3}>
          <Select onChange={(e) => setSortBy(e.target.value)} placeholder="Sort By" fontSize="sm">
            <option value="transaction_date">Date</option>
            <option value="grand_total">Total Amount</option>
          </Select>
          <Button onClick={handleSortDirection} colorScheme="gray" size="sm">
            {sortDirection === 'asc' ? (
              <SortAscending size={20} />
            ) : (
              <SortDescending size={20} />
            )}
          </Button>
        </HStack>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        <Box height="300px">
          <Line data={chartData} options={chartOptions} />
        </Box>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th fontSize="sm">Total</Th>
                <Th fontSize="sm">Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentEntries.map((transaction) => (
                <Tr
                  key={transaction.id}
                  onClick={() => handleTransactionClick(transaction.id)}
                  cursor="pointer"
                  _hover={{ bg: 'gray.100' }}
                >
                  <Td fontSize="sm">{formatToRupiah(transaction.grand_total)}</Td>
                  <Td fontSize="sm">{new Date(transaction.transaction_date).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <HStack justifyContent="center" mt={4}>
            <Button
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              isDisabled={currentPage === 1}
            >
              Previous
            </Button>
            <Text fontSize="sm">
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              isDisabled={currentPage === totalPages}
            >
              Next
            </Button>
          </HStack>
        </Box>
      </SimpleGrid>

      <TransactionDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        transactionId={selectedTransactionId}
      />
    </Box>
  );
};

export default TransactionReport;
