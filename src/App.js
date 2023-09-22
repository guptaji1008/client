import React from 'react'
import './App.css'
import './bootstrap.min.css'
import BookMovie from './components/BookMovie'

export default function App() {

  const serverUrl = process.env.REACT_APP_SERVER_URL

  return (
    <div>
      <BookMovie serverUrl={serverUrl}/>
    </div>
  )
}
