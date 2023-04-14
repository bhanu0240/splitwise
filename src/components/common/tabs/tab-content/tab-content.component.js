import React from 'react'
import "./tab-content.component.js"

function TabContent({ id, selectedTab, children }) {

  return selectedTab === id ? (
    <div id={id}>
      {children}
    </div>
  ) : null;
}

export default TabContent