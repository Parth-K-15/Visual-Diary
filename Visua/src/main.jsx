import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// import "./index.css";
// import Home from './Pages/Home'
// import Home from './Pages/AddMemo'
import App from "./App";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <Home /> */}
      <App/>
    </BrowserRouter>
  </React.StrictMode>
)


// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import Home from './Pages/Home'
// import Traditional from './Pages/Traditional'
// import AddMemo from './Pages/AddMemo'
// import './index.css'

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />
//   },
//   {
//     path: "/Home",
//     element: <Home />
//   },
//   {
//     path: "/traditional",
//     element: <Traditional />
//   },
//   {
//     path: "/Addmemo",
//     element: <AddMemo />
//   },
//   {
//     path: "*", element: <>Not Found</>
//   }
// ])

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// )