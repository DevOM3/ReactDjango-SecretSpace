import React, { useEffect } from 'react';
import { actionTypes } from '../context/reducer';
import {useStateValue} from '../context/StateProvider';

const Secrets = ({id, secret}) => {
    const [{userInfo}, dispatch] = useStateValue();

    useEffect(() => {
        const checkIfVisible = () => {
            const element = document.getElementById(id);
            var coords = element.getBoundingClientRect();
            Math.abs(coords.top) <= document.getElementById("secretPage").getBoundingClientRect().height - 51
            ? element.classList.add("snap")
            : element.classList.contains("snap") && element.classList.remove("snap");
        }
        document.getElementById("secretPage").addEventListener('scroll', checkIfVisible);
        checkIfVisible();
    }, [id]);

    const handleDelete = e => {
        e.preventDefault();
        fetch(`/api/delete-secret`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                username: userInfo.username,
            })
        }).then(response => response.json()).then(data => dispatch({
            type: actionTypes.SET_SECRETS,
            secrets: data,
        }));
    }

    return (
        <div className="secrets" id={id} onDoubleClick={handleDelete}>
            <p className="secrets__text">{secret}</p>
        </div>
    )
}

export default Secrets;
