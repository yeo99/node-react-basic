import './App.css';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'

import LoginPage from './components/views/LoginPage/LoginPage'

import RegisterPage from './components/views/RegisterPage/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* exact는 path속성에 넣은 경로값이 정확히 URL의 경로값과 일치할 때만 렌더링 되도록 도움 */}
        <Route exact path="/" element = {<LandingPage/>}/>

        <Route exact path="/login" element = {<LoginPage/>}/>

        <Route exact path="/register" element = {<RegisterPage/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;