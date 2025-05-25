import { useState } from 'react'
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { parseVoiceCommand, VoiceCommandResult } from '../utils/parseVoiceCommand'
import api from '../api'

export default function VoiceCommands() {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const [parsedCommand, setParsedCommand] = useState<VoiceCommandResult | null>(null)
  const toast = useToast()

  const handleListen = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('This browser does not support speech recognition.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)

    recognition.onresult = async (event: any) => {
      const result = event.results[0][0].transcript
      setTranscript(result)
      console.log('🎙 Speech:', result)

      const parsed = parseVoiceCommand(result)
      setParsedCommand(parsed)

      if (parsed) {
        console.log('✅ Parsed Command:', parsed)

        try {
          const response = await api.post('/items', {
            name: parsed.itemName,
            quantity: parsed.quantity,
            unit: parsed.unit,
            action: parsed.action,
          })

          toast({
            title: `Item ${parsed.action === 'add' ? 'added/updated' : 'removed'} successfully!`,
            description: `${parsed.quantity} ${parsed.unit} of ${parsed.itemName}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } catch (err) {
          console.error('❌ Error handling command:', err)
          toast({
            title: 'Failed to process item.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      } else {
        toast({
          title: 'Could not understand the command',
          description: 'Try saying something like "Add 3 kg carrots"',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        })
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      toast({
        title: 'Speech recognition error',
        description: event.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }

    recognition.start()
  }

  return (
    <Box p={6}>
      <Heading fontSize="2xl" mb={4}>🎤 Voice Commands</Heading>
      <VStack spacing={4} align="start">
        <Button
          onClick={handleListen}
          colorScheme="teal"
          isLoading={listening}
          loadingText="Listening..."
        >
          Start Listening
        </Button>

        {transcript && <Text><strong>Transcript:</strong> {transcript}</Text>}
        {parsedCommand && (
          <Box>
            <Text><strong>Action:</strong> {parsedCommand.action}</Text>
            <Text><strong>Item:</strong> {parsedCommand.itemName}</Text>
            <Text><strong>Quantity:</strong> {parsedCommand.quantity} {parsedCommand.unit}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  )
}
