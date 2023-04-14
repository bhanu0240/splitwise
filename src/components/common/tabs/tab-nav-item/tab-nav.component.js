import React from 'react'
import "./tab-nav.component.css"

function TabNavItem({ className, title, id, onClick }) {
  return (
    <div className={className} id={id} onClick={onClick}>{title}</div>
  )
}

export default TabNavItem