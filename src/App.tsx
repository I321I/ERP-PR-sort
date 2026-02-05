import { Container } from 'react-bootstrap'
import { InputField } from './components/InputField'
import { Navigation } from './components/Navigation.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <Container>
        <Navigation />
        <InputField />
      </Container>
    </>
  )
}

export default App
