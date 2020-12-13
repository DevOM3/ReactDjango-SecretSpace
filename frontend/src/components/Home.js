import React, { useEffect, useState } from 'react';
import { useStateValue } from '../context/StateProvider';
import SecretPage from './SecretPage';
import Sidebar from './Sidebar';
import EditPage from './EditPage';
import { actionTypes } from "../context/reducer";

const Home = () => {
    const [{userData}, dispatch] = useStateValue();
    const [showEditPage, setShowEditPage] = useState(false);

    const getUserInfo = () => {
        if (userData) {
            fetch(`/api/get-user?username=${userData?.username}`).then(response => response.json()).then(data => dispatch({
                type: actionTypes.SET_USER_INFO,
                userInfo: data,
            }));
        }
    }

    useEffect(() => {
        getUserInfo();
    }, [userData]);

    return (
        <div className="home">
            <Sidebar setShowEditPage={setShowEditPage} showEditPage={showEditPage} /> 
            {
                showEditPage
                ? <EditPage setShowEditPage={setShowEditPage} />
                : <SecretPage />
            }
        </div>
    )
}

export default Home;
