import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import StreamingPage from './components/StreamingPlayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:movieId" element={<StreamingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
