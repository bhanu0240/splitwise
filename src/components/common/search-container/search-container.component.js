import React, {useRef} from 'react'


function Search({filterData,className}) {
  const searchRef=useRef("");

  const handleChange=()=>{
    const searchValue=searchRef.current.value;
    filterData(searchValue);
  }

  function debounce_leading(func, timeout = 300){
    let timer;
    return (...args) => {
      if (!timer) {
        func.apply(this, args);
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
      }, timeout);
    };
  }
  return (
    <div className={`search-container ${className}`}>
        <input ref={searchRef} onChange={debounce_leading(handleChange,300)} className={className}></input>
    </div>
  )
}

export default Search