import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import { Button, TextField, Typography } from '@material-ui/core';
import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';

const Login = () => {
    const history = useHistory();
    const [{userData}, dispatch] = useStateValue();
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const login = e => {
        e.preventDefault();

        if (username.trim() === "" || password.trim() === "") {
            username.trim() === "" && setUsernameError("You must enter Username")
            password.trim() === "" && setPasswordError("You must enter Password")
            return
        }

        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        }).then(response => response.json()).then(data => {
            if (data.username && data.password) {
                dispatch({
                    type: actionTypes.SET_USER_DATA,
                    userData: {
                        username: data.username,
                        password: data.password,
                    },
                });
                setUsername("");
                setUsernameError("");
                setPassword("");
                setPasswordError("");
                history.push(`/home`)
            } else if (data.error) {
                setUsername("");
                setUsernameError(data.error);
                setPassword("");
                setPasswordError(data.error);
            } else {
                alert("An error occured. Try again!")
            }
        })
    }

    const handleUsernameChange = e => {
        setUsername(e.target.value)
        if (e.target.value.trim() !== "") {
            setUsernameError("");
        }
    }
    const handlePasswordChange = e => {
        setPassword(e.target.value)
        if (e.target.value.trim() !== "") {
            setPasswordError("");
        }
    }

    return (
        <div className="login">
            <form autoComplete="off" >
            <Typography variant="h3" component="h3">
                Log In
            </Typography>
                <TextField
                    error={usernameError}
                    value={username}
                    onChange={handleUsernameChange}
                    helperText={usernameError}
                    required
                    id="username"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    style={{marginTop: 11}}
                />
                <div className="login__Separator">

                </div>
                <TextField
                    error={passwordError}
                    value={password}
                    onChange={handlePasswordChange}
                    helperText={passwordError}
                    required
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    variant="outlined"
                    fullWidth
                />
                <div className="login__Separator">

                </div>
                <Button variant="contained" color="secondary" type="submit" onClick={login}>
                    Explore space
                </Button>
                <div className="login__Separator">

                </div>
                <Button variant="contained" color="primary" to="/" component={Link}>
                    Back
                </Button>
            </form>
        </div>
    )
}

export default Login;
