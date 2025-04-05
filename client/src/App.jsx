import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Routes, Route } from 'react-router-dom';
import ResponsiveAppBar from './components/AppBar';
import Home from './Pages/Home';
import AddMemo from './Pages/AddMemo';
import AddMemo2 from './Pages/AddMemo2';
import Traditional from './Pages/Traditional';
import NotFound from './Pages/NotFound'; // Create this component
import ProductHowItWorks from "../modules/views/ProductHowItWorks";
import SignUp from './components/SignUp';

import {useState} from 'react';

// function App() {
//   return (
//     <>
//       {/* <div>Hello World
//         <Router>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/memories" element={<Home />} />
//             <Route path="/add-memo" element={<AddMemo />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </Router>
//       </div> */}
//       <Home />
//       <Traditional />
//       <ProductHowItWorks />
//       <SignUp />
//       <AddMemo />
//       <AddMemo2 />
//       {/* <NotFound/> */}
      
//     </>
//   );
// }

// export default App;



function App() {
  // State to track which component to show
  const [activeComponent, setActiveComponent] = useState('ProductHowItWorks');

  return (
    <>
      {/* <ResponsiveAppBar /> */}
      
      {/* Component Switcher */}
      {activeComponent === 'ProductHowItWorks' && (
        <ProductHowItWorks 
          onStartJournaling={() => setActiveComponent('SignUp')} 
        />
      )}
      
      {activeComponent === 'SignUp' && (
        <SignUp 
          onBack={() => setActiveComponent('ProductHowItWorks')}
        />
      )}
    </>
  );
}

export default App;