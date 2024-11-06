import {Navigate} from "react-router-dom";


function PrivateRoute({element:Component}) {
    const accessToken = localStorage.getItem('accessToken');

    return accessToken ? <Component /> : <Navigate to="/login" replace />
}

export default PrivateRoute;