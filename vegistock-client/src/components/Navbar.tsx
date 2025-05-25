import { Box, Flex, Link, Heading } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/voice', label: 'Voice Commands' },
]

export default function Navbar() {
  return (
    <Box bg="teal.600" px={6} py={4} color="white">
      <Flex align="center" justify="space-between">
        <Heading fontSize="lg">🥦 VegiStock</Heading>
        <Flex gap={4}>
          {navItems.map(({ to, label }) => (
            <Link
              as={NavLink}
              key={to}
              to={to}
              _hover={{ textDecoration: 'underline' }}
              _activeLink={{ fontWeight: 'bold', textDecoration: 'underline' }}
            >
              {label}
            </Link>
          ))}
        </Flex>
      </Flex>
    </Box>
  )
}
