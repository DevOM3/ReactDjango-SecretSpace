import React, { useEffect, useState } from 'react';
import { Avatar, Button, makeStyles, TextField, Typography } from "@material-ui/core";
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

const EditPage = ({setShowEditPage}) => {
    const classes = useStyles();
    const [{userInfo}, dispatch] = useStateValue();
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("");
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [bio, setBio] = useState("");
    const [bioError, setBioError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    useEffect(() => {
        setImageURL(userInfo.profile_image);
        setName(userInfo.name);
        setBio(userInfo.bio);
        setPassword(userInfo.password);
        setConfirmPassword(userInfo.password);
    }, [userInfo])

    const saveChanges = e => {
        e.preventDefault();
        if(name.trim() === "" || bio.trim() === "" || password === "" || password !== confirmPassword || name.length < 2 || bio.length < 11 || password.length < 8) {
            name.trim() === "" && setNameError("Name cannot be empty");
            name.length < 2 && name.trim() !== "" && setNameError("Name must be at least 2 characters long");
            name.length >= 2 && name.trim() !== "" && setNameError("");
            bio.trim() === "" && setBioError("Bio cannot be empty");
            bio.length < 11 && bio.trim() !== "" && setBioError("Bio must be at least 11 characters long");
            bio.length >= 11 && bio.trim() !== "" && setBioError("");
            password === "" && setPasswordError("Password cannot be empty");
            password.length < 8 && password !== "" && setPasswordError("Password must be at least 8 characters long");
            password.length >= 8 && password !== "" && setPasswordError("");
            confirmPassword !== password && setConfirmPasswordError("Password did not match");
        } else {
            let formData = new FormData();
            formData.append('name', name);
            formData.append('username', userInfo.username);
            formData.append('bio', bio);
            formData.append('password', password);
            image && formData.append('profile_image', image, image.name)

            axios.post('/api/update-user', formData, {
                headers: {
                    'Content-Type': "multipart/form-data"
                }
            }).then(response => response).then(response => {
                if (response.status === 201) {
                    dispatch({
                        type: actionTypes.SET_USER_INFO,
                        userInfo: response.data,
                    });
                    
                    setName("");
                    setNameError("");
                    setBio("");
                    setBioError("");
                    setPassword("");
                    setPasswordError("");
                    setConfirmPassword("");
                    setConfirmPasswordError("");
                    setImage(null);
                    setImageURL("");
                    setShowEditPage(false);
                } else {
                    alert("Sorry, an internal error occured! Try again")
                }
            }).catch(error => console.log(error));
        }
    }

    const handleNameChange = e => {
        setName(e.target.value)
        if(nameError && e.target.value.trim() !== "" && e.target.value.length >= 2 && e.target.value.length <= 11) {
            setNameError("");
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
        if(confirmPasswordError === password) {
            setConfirmPasswordError("");
        }
    }
    const handleImageChange = e => {
        setImage(e.target.files[0])
        setImageURL(URL.createObjectURL(e.target.files[0]));
    }

    return (
        <div className="editPage">
            <Typography variant="h3" component="h3">
                Edit Profile
            </Typography>
            <form autoComplete="off">
                <input accept="image/*" className={classes.input} id="icon-button-file" type="file" required onChange={handleImageChange}/>
                <label htmlFor="icon-button-file">
                    <Avatar src={imageURL} style={{height: 121, width: 121, marginRight: 0}}/>
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
                <div className="editPage__passwordGroup">
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
                    <div className="editPage__passwordGroupSeparator">

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
                <Button variant="contained" color="secondary" type="submit" onClick={saveChanges}>
                    Save Changes
                </Button>
                <div className="editPage__passwordGroupSeparator">

                </div>
                <Button variant="contained" color="primary" onClick={() => setShowEditPage(false)}>
                    Back
                </Button>
            </form>
        </div>
    )
}

export default EditPage;
