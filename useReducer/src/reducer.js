

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD_TODO":
            return [...state, action.payload];
        case "GET_TODO":
            return action.payload;
        case "REMOVE_TODO":
            return state.filter(todo => todo.id !== action.payload.id);
        case "UPDATE_TODO":
            return state.map(todo => 
                todo.id === action.payload.id ? action.payload : todo
            );
        default:
            return state;
    }
}

export default reducer;