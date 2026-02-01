import { Container } from 'react-bootstrap'
import { InputField } from './components/inputField'
import { DateSelector } from './components/date'

function App() {
  return (
    <>
      <Container>
        <DateSelector></DateSelector>
        <InputField></InputField>
      </Container>
    </>
  )
}

export default App
