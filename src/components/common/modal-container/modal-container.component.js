import React from 'react'
import CLOSEICON from "../../../assets/images/close-icon.png"
import "./modal-container.component.css"


function ModalContainer({ className, children, onClose, title }) {
  return (
    <div className={`modal ${className}-modal`}>
      <div className="close-icon" >
        <img className="icon" src={CLOSEICON} alt={"add-firend-close-icon"} onClick={onClose} />
      </div>
      <div className={`title ${className}-title`}>{title}</div>
      {children}
    </div>
  )
}

export default ModalContainer;