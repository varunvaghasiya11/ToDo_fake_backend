import { useState, useReducer, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import reducer from './reducer'

function App() {
  
  const [state, dispatch] = useReducer(reducer, [])
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!input) return;

    if (editingId) {
      try {
        const todoToUpdate = state.find(t => t.id === editingId);
        const updatedTodo = { ...todoToUpdate, text: input };
        const { data } = await axios.put(`http://localhost:3000/users/${editingId}`, updatedTodo);
        dispatch({ type: "UPDATE_TODO", payload: data });
        setEditingId(null);
        setInput("");
      } catch (error) {
        console.error("Failed to update todo", error);
      }
    } else {
      const newTodo = { id: Date.now().toString(), text: input };
      try {
        const { data } = await axios.post('http://localhost:3000/users', newTodo);
        dispatch({ type: "ADD_TODO", payload: data });
        setInput("");
      } catch (error) {
        console.error("Failed to save todo", error);
      }
    }
  }

  const handleGetTodo = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/users');
      dispatch({ type: "GET_TODO", payload: data });
    } catch (error) {
      console.error("Failed to load todos", error);
    }
  }

  const handleRemoveTodo = async (todo) => {
    try {
      await axios.delete(`http://localhost:3000/users/${todo.id}`);
      dispatch({ type: "REMOVE_TODO", payload: todo });
    } catch (error) {
      console.error("Failed to delete todo", error);
    }
  }

  useEffect(() => {
    handleGetTodo();
  }, []);


  return (
    <div className="app-container">
        <h1>Todo List</h1>
        <form className="todo-form" onSubmit={handleAddTodo}>
          <input 
            className="todo-input"
            type="text" 
            placeholder={editingId ? "Update your task" : "Add a todo"} 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn" type="submit">{editingId ? "Update" : "Add"}</button>
          {editingId && (
            <button className="btn btn-secondary" type="button" onClick={() => { setEditingId(null); setInput(""); }}>Cancel</button>
          )}
        </form>
        <div className="todo-list">
          {state.map((todo) => {
            console.log(todo);
            return (
              <div key={todo.id} className="todo-item">
                <p className="todo-text">{todo.text}</p>
                <div className="todo-actions">
                  <button className="btn btn-secondary" onClick={() => { setEditingId(todo.id); setInput(todo.text); }}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleRemoveTodo(todo)}>Remove</button>
                </div>
              </div>
            );
          })
        }
        </div>
    </div>
  )
}

export default App
