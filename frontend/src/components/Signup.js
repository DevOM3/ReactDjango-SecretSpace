import React, { useEffect, useState } from 'react';
import { Avatar, Button, makeStyles, TextField, Typography } from "@material-ui/core";
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
    },
  }));

const Signup = () => {
    const history = useHistory();
    const classes = useStyles();
    const [{}, dispatch] = useStateValue();
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [bio, setBio] = useState("");
    const [bioError, setBioError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const signup = e => {
        e.preventDefault();
        if(name.trim() === "" || username.trim() === "" || bio.trim() === "" || password === "" || password !== confirmPassword || name.length < 2 || username.length < 2 || bio.length < 11 || password.length < 8) {
            name.trim() === "" && setNameError("Name cannot be empty");
            name.length < 2 && name.trim() !== "" && setNameError("Name must be at least 2 characters long");
            name.length >= 2 && name.trim() !== "" && setNameError("");
            username.trim() === "" && setUsernameError("Username cannot be empty");
            username.length < 2 && username.trim() !== "" && setUsernameError("Username must be 2 to 11 characters long");
            username.length >= 2 && username.trim() !== "" && setUsernameError("");
            bio.trim() === "" && setBioError("Bio cannot be empty");
            bio.length < 11 && bio.trim() !== "" && setBioError("Bio must be at least 11 characters long");
            bio.length >= 11 && bio.trim() !== "" && setBioError("");
            password === "" && setPasswordError("Password cannot be empty");
            password.length < 8 && password !== "" && setPasswordError("Password must be at least 8 characters long");
            password.length >= 8 && password !== "" && setPasswordError("");
            confirmPassword !== password && setConfirmPasswordError("Password did not match");
        } else {
            if (image) {
                let formData = new FormData();
                formData.append('name', name);
                formData.append('username', username);
                formData.append('bio', bio);
                formData.append('password', password);
                formData.append('profile_image', image, image.name);

                axios.post('/api/signup', formData, {
                    headers: {
                        'Content-Type': "multipart/form-data"
                    }
                }).then(response => response).then(response => {
                    if (response.status === 201) {
                        dispatch({
                            type: actionTypes.SET_USER_DATA,
                            userData: {
                                username: response.data.username,
                                password: response.data.password,
                            },
                        });
                        
                        setName("");
                        setNameError("");
                        setUsername("");
                        setUsernameError("");
                        setBio("");
                        setBioError("");
                        setPassword("");
                        setPasswordError("");
                        setConfirmPassword("");
                        setConfirmPasswordError("");
                        setImage(null);
                        history.push(`/home`);
                    } else if (response.status === 200) {
                        if (response.data.username[0] === "user info with this username already exists."){
                            setUsernameError("User info with this username already exists.")
                            return
                        } else if (response.data.username[0] === "Ensure this field has no more than 11 characters."){
                            setUsernameError("Ensure this field has no more than 11 characters.");
                            return
                        }
                    } else {
                        alert("Sorry, an internal error occured! Try again")
                    }
                }).catch(error => console.log(error));
            } else {
                alert("You must upload a profile image")
            }
        }
    }

    const handleNameChange = e => {
        setName(e.target.value)
        if(nameError && e.target.value.trim() !== "" && e.target.value.length >= 2 && e.target.value.length <= 11) {
            setNameError("");
        }
    }
    const handleUsernameChange = e => {
        setUsername(e.target.value.replace(" ", ""));
        if(usernameError && e.target.value.trim() !== "" && e.target.value.length >= 2) {
            setUsernameError("");
        }
    }
    const handleBioChange = e => {
        setBio(e.target.value)
        if(bioError && e.target.value.trim() !== "" && e.target.value.length >= 11) {
            setBioError("");
        }
    }
    const handlePasswordChange = e => {
        setPassword(e.target.value)
        if(passwordError && e.target.value.trim() !== "" && e.target.value.length >= 8) {
            setPasswordError("");
        }
    }
    const handleConfirmPasswordChange = e => {
        setConfirmPassword(e.target.value)
        if(confirmPasswordError && e.target.value.trim() === password) {
            setConfirmPasswordError("");
        }
    }

    return (
        <div className="signup">
            <Typography variant="h3" component="h3">
                Sign Up
            </Typography>
            <form autoComplete="off">
                <input accept="image/*" className={classes.input} id="icon-button-file" type="file" required onChange={e => setImage(e.target.files[0])}/>
                <label htmlFor="icon-button-file">
                    <Avatar src={image && URL.createObjectURL(image)} style={{height: 121, width: 121, marginRight: 0}}/>
                </label>

                <TextField
                    error={nameError}
                    value={name}
                    onChange={handleNameChange}
                    helperText={nameError}
                    required
                    id="name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    style={{marginTop: 11}}                 
                />
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
                <TextField
                    error={bioError}
                    value={bio}
                    onChange={handleBioChange}
                    helperText={bioError}
                    required
                    id="bio"
                    label="Bio"
                    variant="outlined"
                    fullWidth
                    style={{marginTop: 11}}
                />
                <div className="signup__passwordGroup">
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
                    <div className="signup__passwordGroupSeparator">

                    </div>
                    <TextField
                        error={confirmPasswordError}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        helperText={confirmPasswordError}
                        required
                        id="confirm-password"
                        label="Confirm Password"
                        type="password"
                        autoComplete="current-password"
                        variant="outlined"
                        fullWidth
                    />
                </div>
                <Button variant="contained" color="secondary" type="submit" onClick={signup}>
                    Explore space
                </Button>
                <div className="signup__passwordGroupSeparator">

                </div>
                <Button variant="contained" color="primary" to="/" component={Link}>
                    Back
                </Button>
            </form>
        </div>
    )
}

export default Signup;
