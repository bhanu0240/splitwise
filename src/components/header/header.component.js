import React from 'react'
import "./header.component.css"
import profileimage from "../../assets/images/profile-picture.webp"

export default function Header({title,name}) {
  return (
    <header>
    <h1>{title}</h1>
    <div class="profile">
      <img src={profileimage} alt="Signed in User"/>
      <p>{name}</p>
    </div>
  </header>
  
  )
}
