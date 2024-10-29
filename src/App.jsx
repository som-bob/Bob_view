/* 전체 어플리케이션의 라우팅 설정 */

import {Route, Router, Routes} from "react-router-dom";
import BoardList from './components/BoardList.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" component={BoardList} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
            </Routes>
        </Router>
    );
}

export default App
