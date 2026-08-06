import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Home, Projects,ToonHubHero,ShoeCustomizer,AppleStyleLanding , Contact } from './pages';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <main className="bg-slate-300/20 h-[100vh]">
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/projects' element={<Projects />} /> 
          <Route path='/AppleStyleLanding' element={<AppleStyleLanding />} />
          <Route path="/ToonHubHero" element={<ToonHubHero />} />
          <Route path="/ShoeCustomizer" element={<ShoeCustomizer />} />

          <Route path='/contact' element={<Contact />} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;