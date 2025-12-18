import express from 'express'
const router = express.Router()

router.post('/detect-image', async (req, res) => {
  const { image } = req.body

  const base64Data = image.replace(/^data:image\/jpeg;base64,/, '')
  const fs = require('fs')
  const path = 'tmp.jpg'
  fs.writeFileSync(path, base64Data, 'base64')

  const { exec } = require('child_process')
  exec(`python3 model.py ${path}`, (err: any, stdout: any) => {
    if (err) return res.status(500).json({ error: 'Model error' })

    // נניח שהמודל מחזיר JSON בטקסט
    const result = JSON.parse(stdout)
    res.json(result)
  })
})

export default router
