import { Box, Heading, Flex, Text } from "@chakra-ui/react";
import SidebarAdmin from "@/components/dashboard-admin/SidebarAdmin";
import ProductListAdmin from "@/components/dashboard-admin/ProductListAdmin";

const ProductAdmin = () => {
  return (
    <Flex height="100vh">
      <SidebarAdmin />
      <Box flex="1" display="flex">
        <Box flex="3" bg="none" m="4" p="4">
          <ProductListAdmin />
        </Box>
        <Box flex="1" bg="none" m="4" p="4">
          <Text>Add New Product</Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default ProductAdmin