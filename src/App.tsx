import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { InputField } from './inputField'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Container>
        <InputField></InputField>
      </Container>
    </>
  )
}

export default App
