import stringSimilarity from 'string-similarity'

export type ActionType = 'add' | 'remove'
export type UnitType = 'kg' | 'gram' | 'unit'

export interface VoiceCommandResult {
  action: ActionType
  itemName: string
  quantity: number
  unit: UnitType
}

const knownVegetables = [
  'tomato',
  'onion',
  'carrot',
  'cucumber',
  'pepper',
  'potato',
  'garlic',
  'broccoli',
  'spinach',
  'lettuce',
]

const addWords = ['add', 'insert', 'put', 'increase']
const removeWords = ['remove', 'delete', 'take', 'decrease']

const unitWords: Record<UnitType, string[]> = {
  kg: ['kg', 'kilogram', 'kilograms', 'kilos'],
  gram: ['g', 'gram', 'grams'],
  unit: ['unit', 'units', 'piece', 'pieces']
}

export function parseVoiceCommand(text: string): VoiceCommandResult | null {
  const lower = text.toLowerCase()

  // 1. Detect action
  let action: ActionType | null = null
  if (addWords.some(w => lower.includes(w))) action = 'add'
  else if (removeWords.some(w => lower.includes(w))) action = 'remove'
  if (!action) return null

  // 2. Detect quantity
  const quantityMatch = lower.match(/(\d+(\.\d+)?)/)
  const quantity = quantityMatch ? parseFloat(quantityMatch[0]) : 1

  // 3. Detect unit
  let unit: UnitType = 'unit'
  for (const [u, words] of Object.entries(unitWords)) {
    if (words.some(w => lower.includes(w))) {
      unit = u as UnitType
      break
    }
  }

  // 4. Try to extract best matching item
  const words = lower.split(/\s+/)
  const itemCandidates = words.filter(word => !addWords.includes(word) && !removeWords.includes(word))
  const bestMatch = stringSimilarity.findBestMatch(itemCandidates.join(' '), knownVegetables)
  const { bestMatch: { rating, target } } = bestMatch

  if (rating < 0.45) return null // לא זיהינו ירק באופן אמין

  return {
    action,
    itemName: target,
    quantity,
    unit,
  }
}
