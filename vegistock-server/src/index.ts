import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// בדיקת שרת
app.get('/', (_req, res) => {
  res.send('✅ VegiStock API is running!')
})

// קבלת כל הפעולות (add/remove)
app.get('/api/items', async (_req, res) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(items)
  } catch (error) {
    console.error('❌ Failed to fetch items:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// הוספת פעולה חדשה (add/remove)
app.post('/api/items', async (req, res) => {
  const { name, quantity, unit, action } = req.body

  if (!name || quantity === undefined || !unit || !action) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const item = await prisma.item.create({
      data: {
        name,
        quantity: parseFloat(quantity),
        unit,
        action
      }
    })
    res.status(201).json(item)
  } catch (error) {
    console.error('❌ Failed to create item:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/detect-image', async (req, res) => {
  const { name, quantity, unit } = req.body

  if (!name || !quantity || !unit) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const action = 'add' // אפשר גם להעביר מהקליינט בעתיד

    const item = await prisma.item.create({
      data: {
        name,
        quantity: parseFloat(quantity),
        unit,
        action
      }
    })

    res.status(201).json({ message: 'Image detection saved', item })
  } catch (error) {
    console.error('❌ Failed to save detection result:', error)
    res.status(500).json({ error: 'Server error' })
  }
})


// fallback לנתיב לא קיים
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
