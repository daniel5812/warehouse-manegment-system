// src/pages/Inventory.tsx
import { useEffect, useState } from 'react'
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Text, useToast
} from '@chakra-ui/react'
import api from '../api'

interface RawItem {
  name: string
  quantity: number
  unit: string
  action: 'add' | 'remove'
}

interface AggregatedItem {
  name: string
  totalQuantity: number
  unit: string
}

export default function Inventory() {
  const [items, setItems] = useState<AggregatedItem[]>([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const fetchAndAggregateItems = async () => {
    try {
      const res = await api.get<RawItem[]>('/items')
      const data = res.data

      const grouped = data.reduce<Record<string, AggregatedItem>>((acc, item) => {
        const key = `${item.name}-${item.unit}`
        if (!acc[key]) {
          acc[key] = { name: item.name, unit: item.unit, totalQuantity: 0 }
        }

        acc[key].totalQuantity += (item.action === 'add' ? 1 : -1) * item.quantity
        return acc
      }, {})

      setItems(Object.values(grouped))
    } catch (err) {
      console.error('❌ Failed to fetch inventory:', err)
      toast({
        title: 'Error loading inventory',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAndAggregateItems()
  }, [])

  return (
    <Box p={6}>
      <Heading fontSize="2xl" mb={4}>📊 Inventory</Heading>

      {loading ? (
        <Spinner />
      ) : items.length > 0 ? (
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Total Quantity</Th>
              <Th>Unit</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, idx) => (
              <Tr key={idx}>
                <Td>{item.name}</Td>
                <Td>{item.totalQuantity}</Td>
                <Td>{item.unit}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>No inventory data yet.</Text>
      )}
    </Box>
  )
}
