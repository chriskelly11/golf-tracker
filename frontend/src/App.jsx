import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AddGolfer from './pages/AddGolfer'; 
import ManageGolfers from './pages/ManageGolfers';
import ManageScores from './pages/ManageScores';  
import EditGolfer from './pages/EditGolfer';
import ManageCourses from './pages/ManageCourses';
import AddCourse from './pages/AddCourse';
import AddScores from './pages/AddScores';
import RoundDetails from './pages/RoundDetails';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/manage-golfers" element={<ManageGolfers />} />
      <Route path="/add-golfer" element={<AddGolfer />} />
      <Route path="/edit-golfer/:id" element={<EditGolfer />} />
      <Route path='/add-course' element={<AddCourse />} />
      <Route path='/manage-courses' element={<ManageCourses />} />
      <Route path='/add-scores' element={<AddScores/>} />
      <Route path="/manage-scores" element={<ManageScores />} />
      <Route path="/round/:roundId" element={<RoundDetails />} />
   {/* <Route path="/handicap/" element={<Rabbit/>} /> */}
      {/* <Route path="/rabbit/:roundId" element={<Rabbit/>} /> */}

      {/* <Route path="/edit-scores/:roundId" element={<EditScores />} /> */}
    </Routes>
  </Router>
    // <>
    //   <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
  )
}

export default App
