export const initialState = {
    userInfo: null,
    secrets: [],
    userData: null,
};

export const actionTypes ={
    SET_USER_INFO : "SET_USER_INFO",
    SET_SECRETS: "SET_SECRETS",
    SET_USER_DATA: "SET_USER_DATA",
};

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo
            };

        case actionTypes.SET_SECRETS:
            return {
                ...state,
                secrets: action.secrets
            };
    
        case actionTypes.SET_USER_DATA:
            return {
                ...state,
                userData: action.userData
            };
    
        default:
            return state;
    }
}

export default reducer;
