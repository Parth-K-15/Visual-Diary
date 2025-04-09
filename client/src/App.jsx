// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Routes, Route } from 'react-router-dom';
import ResponsiveAppBar from './components/AppBar';
import Home from './Pages/Home';
import AddMemo from './Pages/AddMemo';
import AddMemo2 from './Pages/AddMemo2';
import Traditional from './Pages/Traditional';
import NotFound from './Pages/NotFound'; // Create this component
// import ProductHowItWorks from './ProductHowItWorks';
import ProductHowItWorks from '../modules/views/ProductHowItWorks';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';

import { useState } from 'react';

// function App() {
//   return (
//     <>
//       <Home />
//       <ProductHowItWorks />
//       <Traditional />
//       <SignUp />
//       <SignIn />
//       <AddMemo />
//       <AddMemo2 />
//       {/* <NotFound/> */}
//     </>
//   );
// }

// export default App;




function App() {
  const [activeComponent, setActiveComponent] = useState('ProductHowItWorks');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [memoryData, setMemoryData] = useState(null);

  const handleSuccessfulLogin = (response) => {
    setIsAuthenticated(true);
    setUserData({
      userId: response.userId,
      username: response.username,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email
    });
    setActiveComponent('AddMemo');
    console.log("Received firstName:", response.firstName);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserData(null);
    setActiveComponent('ProductHowItWorks');
  };

  return (
    <div>

      {/* Component Switcher */}
      {activeComponent === 'ProductHowItWorks' && (
        <ProductHowItWorks
          onStartJournaling={() => {
            isAuthenticated
              ? setActiveComponent('AddMemo')
              : setActiveComponent('SignIn');
          }}
        />
      )}

      {activeComponent === 'SignUp' && (
        <SignUp
          onSignIn={() => setActiveComponent('SignIn')}
        />
      )}

      {activeComponent === 'SignIn' && (
        <SignIn
          onSignUp={() => setActiveComponent('SignUp')}
          onSuccessfulLogin={handleSuccessfulLogin}
        />
      )}

      {activeComponent === 'Home' && (
        <Home
          userData={userData}
          handleLogout={handleLogout}
        />
      )}

      {activeComponent === 'AddMemo' && (
        <AddMemo
          onMemoryCreated={({ memoryId, filenameSafeTitle }) => {
            setActiveComponent('AddMemo2');
            // Store memory data in state or context
            setMemoryData({ memoryId, filenameSafeTitle });
          }}
          onCancel={() => setActiveComponent('Home')}
        />
      )}

      {activeComponent === 'AddMemo2' && memoryData && (
        <AddMemo2
          memoryId={memoryData.memoryId}
          filenameSafeTitle={memoryData.filenameSafeTitle}
          onComplete={() => setActiveComponent('Home')}
          userData={userData}
        />
      )}

    </div>
  );
}

export default App;