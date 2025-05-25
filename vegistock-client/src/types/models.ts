export interface Item {
    id: string
    name: string
    quantity: number
    unit: 'kg' | 'units'
    imageUrl?: string
    lastUpdated: string
  }
  
  export interface Transaction {
    id: string
    itemId: string
    action: 'add' | 'remove'
    quantity: number
    timestamp: string
    source: 'voice' | 'image' | 'manual'
  }
  
  export interface VoiceCommandResult {
    action: 'add' | 'remove'
    itemName: string
    quantity: number
  }
  
  export interface ImageDetectionResult {
    itemName: string
    confidence: number
  }
  