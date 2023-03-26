import React from 'react'
import "./header.component.css"
import profileimage from "../../assets/images/profile-picture.webp"
import { TITLE } from '../../constants/constants'

export default function Header({ title, name }) {
  return (
    <header>
      <h1 className="title">{TITLE}</h1>
      <div className="profile-section">
        <img src={profileimage} alt="signed-user" />
        <span>{name}</span>
      </div>
    </header>
  )
}