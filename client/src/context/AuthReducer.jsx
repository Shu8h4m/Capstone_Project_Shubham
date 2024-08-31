const AuthReducer = (state,action) =>{
    switch(action.type){
        case "LOGIN_START" : return{
            user : null,
            isFetching : true,
            error : false,
        };
        case "LOGIN_SUCCESS" : return{
            user : action.payload,
            isFetching : false,
            error : false,
        };
        case "LOGIN_FAILURE" : return{
            user : null,
            isFetching : false,
            error : action.payload,
        };
        case "FOLLOW" : return{
            ...state,
            user :{
                ...state.user,
                followings : [...state.user.followings, action.payload]
            }
        };
        case "UNFOLLOW" : return{
            ...state,
            user :{
                ...state.user,
                followings : state.user.followings.filter(f => f !== action.payload)
            }
        };
        case 'FETCH_PROFILE_REQUEST':
            return {
                ...state,
                isFetching: true,
                error: null
            };
        case 'FETCH_PROFILE_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isFetching: false,
                error: null
            };
        case 'FETCH_PROFILE_FAILURE':
            return {
                ...state,
                user: null,
                isFetching: false,
                error: action.payload
            };
        case "LOGOUT":
            return {
                 user: null,
                 isFetching: false,
                 error: false,
      };
        default : 
            return state;
    }
};

export default AuthReducer;