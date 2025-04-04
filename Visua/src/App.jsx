import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResponsiveAppBar from './components/AppBar';
import Home from './Pages/Home';
import AddMemo from './Pages/AddMemo';
import Traditional from './Pages/Traditional';
import NotFound from './Pages/NotFound'; // Create this component
import ProductHowItWorks from "../modules/views/ProductHowItWorks";

function App() {
  return (
    <>
      {/* <div>Hello World
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/memories" element={<Home />} />
            <Route path="/add-memo" element={<AddMemo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div> */}
      {/* <Home />
      <AddMemo />
      <Traditional/> */}
      {/* <NotFound/> */}
        <ProductHowItWorks/>
    </>
  );
}

export default App;