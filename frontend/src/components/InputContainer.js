import React, { useEffect, useState } from 'react';
import { Button, TextField, withStyles } from '@material-ui/core';
import { useStateValue } from '../context/StateProvider';
import { actionTypes } from '../context/reducer';

const CssTextField = withStyles({
    root: {
       '& label': {
        color: '#dddddd',
       },
      '& label.Mui-focused': {
        color: '#dddddd',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'yellow',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#222222',
        },
        '&:hover fieldset': {
          borderColor: '#222222',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#222222',
        },
      },
    },
})(TextField);

const InputContainer = ({visible = false}) => {
    const [{userInfo}, dispatch] = useStateValue();
    const [input, setInput] = useState("");

    useEffect(() => {
        visible
        ? document.getElementById('inputContainerID').style.transform = "translateY(0px)"
        : document.getElementById('inputContainerID').style.transform = "translateY(-500px)"
    }, [visible]);

    const addSecret = () => {
      fetch(`/api/add-secrets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: input.trim(),
          by: userInfo.username,
        })
      }).then(response => response.json()).then(data => {
        dispatch({
          type: actionTypes.SET_SECRETS,
          secrets: data,
        });
        setInput("");
      });
    }

    return (
        <div className="inputContainer" id="inputContainerID">
            <form>
                <CssTextField
                    label="Enter your secret here"
                    placeholder="Type your secret..."
                    multiline
                    variant="outlined"
                    fullWidth={true}
                    inputProps={{ 
                        style: { 
                            color: 'white', 
                            fontSize: 19,
                            fontFamily: "'Lato', sans-serif",
                            paddingTop: 4,
                            paddingBottom: 7,
                        },
                    }}
                    onChange={e => setInput(e.target.value)}  
                    value={input} 
                />
                <Button 
                    color="primary" 
                    variant="contained" 
                    focusRipple 
                    fullWidth 
                    disabled={!input || !input.trim()}
                    onClick={addSecret}
                >
                    Add
                </Button>
            </form>
        </div>
    )
}

export default InputContainer;
