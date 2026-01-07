import { useState } from 'react'
import React, { Fragment } from 'react'
import './App.css'

// components
import InputTodo from './Component/InputTodo'
import ListTodo from './Component/ListTodos'
import SignIn from './Component/SignIn'
import LogIn from './Component/LogIn'
import MainPage from './Component/MainPage'
import TeamMember from './Component/TeamMember'  // Fix this import

function App() {
  return (
    <div className="container">
      <LogIn />
      {/* You can add the TeamMember component here as needed */}
      {/* <SignIn /> */}
      {/* <InputTodo /> */}
      {/* <ListTodo /> */}
      {/* <MainPage /> */}
      {/* <TeamMember /> */}
    </div>
  )
}

export default App
