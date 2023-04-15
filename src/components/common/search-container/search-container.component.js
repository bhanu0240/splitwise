import React, { useRef } from 'react'
import { debounce } from "lodash";
import "./search-container.component.css"


function Search({ filterData, className }) {
  const search = useRef(null);

  const handleChange = () => {
    const searchValue = search.current.value;
    filterData(searchValue);
  }

  return (
    <div className={`search-container ${className}`}>
      <input
        ref={search}
        onChange={debounce(handleChange, 300)}
        className={`searchBox ${className}`}
        placeholder={'Search Contact'}
      />
    </div>
  )
}

export default Search