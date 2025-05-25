// src/pages/Dashboard.tsx
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  HStack,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface Item {
  id: number
  name: string
  quantity: number
  unit: string
  createdAt: string
}

const Dashboard = () => {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get<Item[]>('http://localhost:5000/api/items')
        setItems(res.data)
      } catch (err) {
        console.error('Failed to fetch items', err)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0)
  const mostRecentItem = items[0]

  const cardBg = useColorModeValue('gray.50', 'gray.700')

  return (
    <Box p={8}>
      <Heading mb={4}>VegiStock Dashboard</Heading>
      <Text fontSize="lg" mb={8}>
        Welcome to your smart vegetable stock system 🍅🥬
      </Text>

      {loading ? (
        <Spinner />
      ) : (
        <SimpleGrid columns={[1, null, 3]} spacing={6}>
          <Stat p={4} bg={cardBg} borderRadius="md" boxShadow="md">
            <StatLabel>Total Items in Stock</StatLabel>
            <StatNumber>{totalQuantity}</StatNumber>
          </Stat>
          <Stat p={4} bg={cardBg} borderRadius="md" boxShadow="md">
            <StatLabel>Transactions Today</StatLabel>
            <StatNumber>{Math.floor(Math.random() * 25)}</StatNumber> {/* Placeholder */}
          </Stat>
          <Stat p={4} bg={cardBg} borderRadius="md" boxShadow="md">
            <StatLabel>Most Recent Item</StatLabel>
            <StatNumber>🥕 {mostRecentItem?.name ?? 'None'}</StatNumber>
          </Stat>
        </SimpleGrid>
      )}

      <HStack spacing={4} mt={10} justify="center" flexWrap="wrap">
        <Button colorScheme="teal" as={RouterLink} to="/camera">
          📷 Open Camera
        </Button>
        <Button colorScheme="purple" as={RouterLink} to="/voice">
          🎤 Voice Command
        </Button>
        <Button colorScheme="orange" as={RouterLink} to="/Actions">
          📦 Go to Actions
        </Button>
      </HStack>
    </Box>
  )
}

export default Dashboard
