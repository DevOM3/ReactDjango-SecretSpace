import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import InputContainer from './InputContainer';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded';
import Secrets from './Secrets';
import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';

const SecretPage = () => {
    const [{userInfo, secrets}, dispatch] = useStateValue();
    const [showInputContainer, setShowInputContainer] = useState(false);

    const getSecrets = () => {
        fetch(`/api/get-secrets`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              by: userInfo.username,
            })
          }).then(response => response.json()).then(data => {
            dispatch({
              type: actionTypes.SET_SECRETS,
              secrets: data,
            });
          });
    }

    useEffect(() => {
        if (userInfo) {
            getSecrets();
        }
    }, [userInfo]);

    useEffect(() => {
        if (showInputContainer) {
            document.getElementsByClassName("secretPage__secretsContainer")[0].style.transform = "translateY(0px)";
        } else {
            document.getElementsByClassName("secretPage__secretsContainer")[0].style.transform = "translateY(-171px)";
        }
    }, [showInputContainer]);

    return (
        <div className="secretPage" id="secretPage">
            <Button variant="text" color="secondary" fullWidth disableRipple onClick={() => setShowInputContainer(!showInputContainer)} style={{zIndex: 111}}>
                {
                    showInputContainer
                    ? <ExpandLessRoundedIcon />
                    : <ExpandMoreRoundedIcon />
                }
            </Button>
            <InputContainer visible={showInputContainer}/>
            <div className="secretPage__secretsContainer">
                {
                    secrets.length && secrets.map(secret => <Secrets key={secret.id} id={secret.id} secret={secret.secret} />)
                }
            </div>
        </div>
    )
}

export default SecretPage;
