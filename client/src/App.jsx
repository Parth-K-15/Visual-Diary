// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Routes, Route } from 'react-router-dom';
// import ResponsiveAppBar from './components/AppBar';
// import Home from './Pages/Home';
// import AddMemo from './Pages/AddMemo';
// import AddMemo2 from './Pages/AddMemo2';
// import Traditional from './Pages/Traditional';
// import NotFound from './Pages/NotFound'; // Create this component
// // import ProductHowItWorks from './ProductHowItWorks';
// import ProductHowItWorks from '../modules/views/ProductHowItWorks';
// import SignUp from './components/SignUp';
// import SignIn from './components/SignIn';

// import { useState } from 'react';

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



import { useState } from 'react';
import ResponsiveAppBar from './components/AppBar';
import Home from './Pages/Home';
import AddMemo from './Pages/AddMemo';
import AddMemo2 from './Pages/AddMemo2';
import ProductHowItWorks from '../modules/views/ProductHowItWorks';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import MemoryDetail from './Pages/MemoryDetail';
import SharedMemory from './Pages/SharedMemory'; // Add this import

function App() {
  const [activeComponent, setActiveComponent] = useState('ProductHowItWorks');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [memoryData, setMemoryData] = useState(null);
  const [selectedMemoryId, setSelectedMemoryId] = useState(null);

  const navigateTo = (component, memoryId = null) => {
    setSelectedMemoryId(memoryId);
    setActiveComponent(component);
  };

  const handleSuccessfulLogin = (response) => {
    setIsAuthenticated(true);
    setUserData({
      userId: response.userId,
      username: response.username,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email
    });
    setActiveComponent('Home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserData(null);
    // setActiveComponent('ProductHowItWorks');
    navigateTo('ProductHowItWorks');
  };

  // Shared props for all components
  const sharedProps = {
    navigateTo,
    userData,
    handleLogout,
    isAuthenticated
  };

  return (
    <div>
      {/* Landing Page */}
      {activeComponent === 'ProductHowItWorks' && (
        <ProductHowItWorks
          onStartJournaling={() => {
            isAuthenticated
              ? navigateTo('AddMemo')
              : navigateTo('SignIn');
          }}
        />
      )}

      {/* Authentication Pages */}
      {activeComponent === 'SignUp' && (
        <SignUp
          onSignIn={() => navigateTo('SignIn')}
          onSuccessfulSignUp={handleSuccessfulLogin}
        />
      )}

      {activeComponent === 'SignIn' && (
        <SignIn
          onSignUp={() => navigateTo('SignUp')}
          onSuccessfulLogin={handleSuccessfulLogin}
        />
      )}

      {/* Authenticated Pages */}
      {isAuthenticated && (
        <>
          {activeComponent === 'Home' && (
            <Home
              {...sharedProps}
              currentComponent="Home"
              onAddMemory={() => navigateTo('AddMemo')}
              onMemoryClick={(action) => {
                if (action === 'create') {
                  navigateTo('AddMemo');
                } else {
                  navigateTo('MemoryDetail', action); // assuming action is memoryId for details
                }
              }}
            />
          )}

          {activeComponent === 'MemoryDetail' && (
            <MemoryDetail
              {...sharedProps}
              memoryId={selectedMemoryId}
              onBack={() => navigateTo('Home')}
            />
          )}

          {activeComponent === 'AddMemo' && (
            <AddMemo
              {...sharedProps}
              currentComponent="AddMemo"
              onMemoryCreated={({ memoryId, previewImageUrl }) => {
                setMemoryData({ memoryId, previewImageUrl });
                navigateTo('AddMemo2');
              }}
              onCancel={() => navigateTo('Home')}
              onComplete={() => navigateTo('Home')}
            />
          )}

          {activeComponent === 'AddMemo2' && memoryData && (
            <AddMemo2
              {...sharedProps}
              currentComponent="AddMemo2"
              memoryId={memoryData.memoryId}
              filenameSafeTitle={memoryData.filenameSafeTitle}
              onComplete={() => navigateTo('Home')}
            />
          )}

          {activeComponent === 'SharedMemo' && (
            <SharedMemory
              {...sharedProps}
              currentComponent="SharedMemo"
              onMemoryClick={(memoryId) => navigateTo('MemoryDetail', memoryId)}
            />
          )}

          {activeComponent === 'Traditional' && (
            <Traditional
              {...sharedProps}
              currentComponent="Traditional"
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;