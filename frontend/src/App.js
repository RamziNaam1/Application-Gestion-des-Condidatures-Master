import React ,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import EtudiantPage from './home/EtudiantPage/EtudiantPage';
import GlobalStyles from './globalStyles';
import Home from './home/Pages/HomePage/Home';
import Services from './home/Pages/Services/Services';
import Products from './home/Pages/Products/Products';
import ScrollToTop from './home/ScrollToTop';
import { Navbar, Footer } from './home';
import AdminLogin from './admin/adminLogin';
import Start from './start';
import Dashboard from './admin/dashboard';
import CoordinatorLogin from './coordinator/coordinatorLogin';
import CoordSignUp from './coordinator/coordSignUp';
import CoordDashboard from './coordinator/coorddashboard';


function App() {
  const [username, setUsername] = useState(null);

  return (
    <Router>
      <React.Fragment>
        <GlobalStyles />
        <ScrollToTop />
        <AppRoutes  setUsername={setUsername}/>
      </React.Fragment>
    </Router>
  );
}

function AppRoutes({ setUsername }) {
  const location = useLocation();
  const hideNavbarFooterRoutes = ['/EtudiantPage','/dashboard','/Start','/AdminLogin','/CoordinatorLogin','/coordSignup','/coorddashboard'];

  const shouldRenderNavbarFooter = !hideNavbarFooterRoutes.includes(location.pathname);
  return (
    <React.Fragment>
      {shouldRenderNavbarFooter && <Navbar />}
      <Routes>
        <Route path='/login' element={<Login setUsername={setUsername} />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Home />} />
        <Route path='/services' element={<Services />} />
        <Route path='/products' element={<Products />} />
        <Route path='/EtudiantPage' element={<EtudiantPage />} />
        <Route path='/AdminLogin' element={<AdminLogin />} />
        <Route path='/Start' element={<Start/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/CoordinatorLogin' element={<CoordinatorLogin/>} />
        <Route path='/coordSignup' element={<CoordSignUp/>} />
        <Route path='/coorddashboard' element={<CoordDashboard/>} />


        

   
        



      </Routes>
      {shouldRenderNavbarFooter && <Footer />}
    </React.Fragment>
  );
}

export default App;
