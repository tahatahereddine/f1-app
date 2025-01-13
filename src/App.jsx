import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Home from './pages/Home';
import Drivers from './pages/Drivers';
import Constructors from './pages/Constructors';
import Standings from './pages/Standings';
import Countries from './pages/Countries';
import Blog from './pages/Blog';
import DriverInfo from './pages/DriverInfo';
import ConstructorInfo from './pages/ConstructorInfo';
import Compare from './pages/Compare';
import CountryInfo from './pages/CountryInfo';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/constructors" element={<Constructors />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/countries" element={<Countries />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/driver-info/:id" element={<DriverInfo />} />
        <Route path="/constructor-info/:id" element={<ConstructorInfo />} />
        <Route path="/country-info/:countryId" element={<CountryInfo />} />
        <Route path="/compare-stats" element={<Compare />}></Route>
      </Routes>
    </Router>
  );
}
export default App;