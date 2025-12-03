import React from "react";
import "../styles/InputSearch.css";

export default function InputSearch({ value, onChange, placeholder }) {
  return (
    <div className="inputSearch-wrapper">
      <input
        id="buscar"
        type="text"
        className="inputSearch"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
