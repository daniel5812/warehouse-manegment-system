import { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  useToast
} from '@chakra-ui/react'
import api from '../api'

interface Item {
  id: number
  name: string
  quantity: number
  unit: string
  createdAt: string
}

export default function Actions() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const fetchItems = () => {
    api.get('/items')
      .then(res => setItems(res.data))
      .catch(err => {
        console.error('❌ Failed to fetch items:', err)
        toast({
          title: 'Failed to load inventory.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <Box p={6}>
      <Heading fontSize="2xl" mb={4}>📦 Actions</Heading>

      {loading ? (
        <Spinner />
      ) : (
        <Table variant="striped" colorScheme="gray" size="md">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Quantity</Th>
              <Th>Unit</Th>
              <Th>Created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.length > 0 ? (
              items.map(item => (
                <Tr key={item.id}>
                  <Td>{item.name}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>{item.unit}</Td>
                  <Td>{new Date(item.createdAt).toLocaleString()}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={4}>
                  <Text>No items yet. Try adding some via voice command! 🎙️</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}
    </Box>
  )
}
