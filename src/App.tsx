import { Container } from 'react-bootstrap';
import { Navigation } from './components/Navigation.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputField } from './components/InputField.tsx';
import "./components/Body.scss"
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
