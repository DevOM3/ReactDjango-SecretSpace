import React, {useEffect} from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Link, Redirect, Route, Switch} from "react-router-dom";
import Home from './Home';
import Login from './Login';
import { Button, ButtonGroup, Typography } from '@material-ui/core';
import Signup from './Signup';
import { StateProvider, useStateValue } from '../context/StateProvider';
import reducer, { initialState, actionTypes } from '../context/reducer';

const App = () => {
    const [{userData}, dispatch] = useStateValue();

    const entryChooser = () => 
    <div className="app__entryChooser">
        <div className="app__entryChooserDiv">
            <Typography variant="h2" component="h2" className="app__title">
                SecretSpace
            </Typography>
            <div className="app_entryChooserSpacing">

            </div>
            <ButtonGroup variant="contained" color="primary">
                <Button color="primary" to="/login" component={Link}>
                    Login
                </Button>
                <Button color="secondary" to="/signup" component={Link}>
                    Signup
                </Button>
            </ButtonGroup>
        </div>
    </div>

    useEffect(() => {
        try {
            const text = document.querySelector('.app__title');
            const stringText = text.textContent;
            const splitText = stringText.split("")

            text.textContent = "";
            for (let i = 0; i < splitText.length; i++) {
                text.innerHTML += "<span>" + splitText[i] + "</span>";
            }

            let character = 0;
            let timer = setInterval(() => {
                const span = text.querySelectorAll('span')[character];
                span.classList.add('fade');
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
    }, []);

    useEffect(() => {
        const checkIfUserExist = async () => fetch("/api/get-user-data").then(response => response.json()).then(data => data.username && data.password && dispatch({
            type: actionTypes.SET_USER_DATA,
            userData: data,
        }));
        checkIfUserExist();
    }, []);

    return (
        <Router>
            <Switch>
                <Route path="/home" component={Home} />
                <Route path="/login">
                    {
                        userData
                        ? <Redirect to='/home' />
                        : <Login />
                    }
                </Route>
                <Route path="/signup">
                    {
                        userData
                        ? <Redirect to='/home' />
                        : <Signup />
                    }
                </Route>
                <Route path="/">
                    {
                        userData
                        ? <Redirect to='/home' />
                        : entryChooser()
                    }
                </Route>
            </Switch>
        </Router>
    )
}

const appDiv = document.getElementById('app');
render(
    <StateProvider reducer={reducer} initialState={initialState}>
        <App/>
    </StateProvider>
, appDiv);
