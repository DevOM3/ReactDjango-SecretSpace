import React, { useEffect } from 'react';
import { Avatar, IconButton } from "@material-ui/core";
import NotesRoundedIcon from '@material-ui/icons/NotesRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import { useStateValue } from "../context/StateProvider";
import { useHistory } from 'react-router-dom';
import { actionTypes } from '../context/reducer';

const Sidebar = ({showEditPage, setShowEditPage}) => {
    const history = useHistory();
    const [{userInfo, userData, secrets}, dispatch] = useStateValue();

    const logout = e => {
        e.preventDefault();

        fetch(`/api/logout`).then(response => response.json()).then(data =>  {
            if (data.success) {
                dispatch({
                    type: actionTypes.SET_USER_INFO,
                    userInfo: null,
                });
                dispatch({
                    type: actionTypes.SET_USER_DATA,
                    userData: null,
                });
            }
        })
    }

    useEffect(() => {
        if (userInfo === null && userData === null) {
            history.push("/");
        }
    }, [userInfo, userData]);

    useEffect(() => {
        const enter = () => {
            document.getElementsByClassName("sidebar__logoutText")[0].style.color = "black";
            document.getElementsByClassName("sidebar__logoutText")[0].style.fontWeight = "bold";
            document.getElementsByClassName("sidebar__logoutText")[0].style.transition = 'all 444ms ease-in-out';
        }
        const leave = () => {
            document.getElementsByClassName("sidebar__logoutText")[0].style.color = "tomato";
            document.getElementsByClassName("sidebar__logoutText")[0].style.fontWeight = "normal";
            document.getElementsByClassName("sidebar__logoutText")[0].style.transition= 'all 444ms ease-in-out';
        }

        document.getElementsByClassName("sidebar__logoutButtonContainer")[0].addEventListener("mouseenter", enter);
        document.getElementsByClassName("sidebar__logoutButtonContainer")[0].addEventListener("mouseover", enter);
        document.getElementsByClassName("sidebar__logoutButtonContainer")[0].addEventListener("mouseout", leave);

        var degree = 0;
        const interval = setInterval(() => {
            if (document.getElementsByClassName("MuiAvatar-img")[0]){
                document.getElementsByClassName("MuiAvatar-circle")[0].style.background = `linear-gradient(red, orange, yellow, greenyellow, lightgreen, green, lightblue, blue, indigo, violet)`
                document.getElementsByClassName("MuiAvatar-circle")[0].style.transform = `rotate(${degree}deg)`
                document.getElementsByClassName("MuiAvatar-img")[0].style.transform = `rotate(-${degree}deg)`
                degree = degree + 1
            } else {
                document.getElementsByClassName("MuiAvatar-circle")[0].style.background = `black`
            }
        }, 21);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (userInfo) {
            try {
                const text = document.querySelector('.sidebar__fullname');
                const stringText = text.textContent;
                const splitText = stringText.split("")

                text.textContent = "";
                for (let i = 0; i < splitText.length; i++) {
                    text.innerHTML += "<span>" + splitText[i] + "</span>";
                }

                let character = 0;
                let timer = setInterval(() => {
                    const span = text.querySelectorAll('span')[character];
                    span.classList.add('fullname');
                    character++;

                    if (character === splitText.length) {
                        complete();
                        return
                    }
                }, 51);

                const complete = () => {
                    clearInterval(timer);
                    timer = null;
                }
            } catch {
                
            }
            try {
                const text = document.querySelector('.sidebar__username');
                const stringText = text.textContent;
                const splitText = stringText.split("")

                text.textContent = "";
                for (let i = 0; i < splitText.length; i++) {
                    text.innerHTML += "<span>" + splitText[i] + "</span>";
                }

                let character = 0;
                let timer = setInterval(() => {
                    const span = text.querySelectorAll('span')[character];
                    span.classList.add('username');
                    character++;

                    if (character === splitText.length) {
                        complete();
                        return
                    }
                }, 51);

                const complete = () => {
                    clearInterval(timer);
                    timer = null;
                }
            } catch {
                
            }
            try {
                const text = document.querySelector('.sidebar__bio');
                const stringText = text.textContent;
                const splitText = stringText.split(" ")

                text.textContent = "";
                for (let i = 0; i < splitText.length; i++) {
                    text.innerHTML += "<span>" + splitText[i] + " </span>";
                }

                let character = 0;
                let timer = setInterval(() => {
                    const span = text.querySelectorAll('span')[character];
                    span.classList.add('bio');
                    character++;

                    if (character === splitText.length) {
                        complete();
                        return
                    }
                }, 51);

                const complete = () => {
                    clearInterval(timer);
                    timer = null;
                }
            } catch {
                
            }
        }
    }, [userInfo]);

    useEffect(() => {
        if (secrets.length > 0) {
            try {
                const text = document.querySelector('.sidebar__numberOfSecret');
                const stringText = text.textContent;
                const splitText = stringText.split("")

                text.textContent = "";
                for (let i = 0; i < splitText.length; i++) {
                    text.innerHTML += "<span>" + splitText[i] + "</span>";
                }

                let character = 0;
                let timer = setInterval(() => {
                    const span = text.querySelectorAll('span')[character];
                    span.classList.add('no');
                    character++;

                    if (character === splitText.length) {
                        complete();
                        return
                    }
                }, 51);

                const complete = () => {
                    clearInterval(timer);
                    timer = null;
                }
            } catch {
                
            }
        }
    }, [secrets])

    return (
        <div className="sidebar">
            <div className="sidebar__top">
                <Avatar src={userInfo?.profile_image} style={{height: 160, width: 160, marginRight: 0, marginTop: 71}}/>
                <h2 className="sidebar__name sidebar__fullname" style={{marginBottom: 0}}>{userInfo?.name}</h2>
                <h5 className="sidebar__name sidebar__username" style={{letterSpacing: 1, marginTop: 4, fontFamily: "'Open Sans', sans-serif"}}>{`(${userInfo?.username})`}</h5>
                <h4 className="sidebar__bio">{userInfo?.bio}</h4>
                <NotesRoundedIcon className="sidebar__secretsIcon"/>
                <h4 className="sidebar__numberOfSecret">{secrets?.length}</h4>
                <IconButton onClick={() => setShowEditPage(!showEditPage)} >
                    <EditRoundedIcon className="sidebar__editIcon"/>
                </IconButton>
            </div>
            <div className="sidebar__logoutButtonContainer" onClick={logout}>
                <h4 className="sidebar__logoutText">Log Out</h4>
            </div>
        </div>
    )
}

export default Sidebar;
