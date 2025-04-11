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
//       <br />
//       <SignUp />
//       <SignIn />
//       <AddMemo />
//       <br />
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
  };

  const navigateTo = (component) => {
    setActiveComponent(component);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserData(null);
    setActiveComponent('ProductHowItWorks');
  };

  return (
    <div>
      {/* Landing Page */}
      {activeComponent === 'ProductHowItWorks' && (
        <ProductHowItWorks
          onStartJournaling={() => {
            isAuthenticated
              ? setActiveComponent('AddMemo')
              : setActiveComponent('SignIn');
          }}
        />
      )}

      {/* Authentication Pages */}
      {activeComponent === 'SignUp' && (
        <SignUp
          onSignIn={() => setActiveComponent('SignIn')}
          onSuccessfulSignUp={handleSuccessfulLogin}
        />
      )}

      {activeComponent === 'SignIn' && (
        <SignIn
          onSignUp={() => setActiveComponent('SignUp')}
          onSuccessfulLogin={handleSuccessfulLogin}
        />
      )}

      {/* Authenticated Pages */}
      {isAuthenticated && (
        <>
          {activeComponent === 'Home' && (
            <Home
              userData={userData}
              handleLogout={handleLogout}
              onAddMemory={() => setActiveComponent('AddMemo')}
              navigateTo={navigateTo}
            />
          )}

          {activeComponent === 'AddMemo' && (
            <AddMemo
              onMemoryCreated={({ memoryId, filenameSafeTitle }) => {
                setMemoryData({ memoryId, filenameSafeTitle });
                setActiveComponent('AddMemo2');
              }}
              onCancel={() => setActiveComponent('Home')}
              onComplete={() => setActiveComponent('Home')}
              userData={userData}
              navigateTo={navigateTo}
              onLogout={handleLogout}
            />
          )}

          {activeComponent === 'AddMemo2' && memoryData && (
            <AddMemo2
              memoryId={memoryData.memoryId}
              filenameSafeTitle={memoryData.filenameSafeTitle}
              onComplete={() => setActiveComponent('Home')}
              userData={userData}
              onLogout={handleLogout}
              navigateTo={navigateTo}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;