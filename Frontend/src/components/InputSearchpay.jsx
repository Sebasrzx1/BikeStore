import React from "react";
import styled from "styled-components";

const InputSearch = ({
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  className,
}) => {
  return (
    <StyledWrapper>
      <div className="inputGroup">
        {/* SVG dentro del input visualmente */}
        <span className="iconolabeltarjeta">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M16.6602 4.16504H3.33203C2.41192 4.16504 1.66602 4.91094 1.66602 5.83105V14.1611C1.66602 15.0812 2.41192 15.8271 3.33203 15.8271H16.6602C17.5803 15.8271 18.3262 15.0812 18.3262 14.1611V5.83105C18.3262 4.91094 17.5803 4.16504 16.6602 4.16504Z"
              stroke="#717182"
              strokeWidth="1.66602"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.66602 8.33008H18.3262"
              stroke="#717182"
              strokeWidth="1.66602"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <input
          id={placeholder.replace(/\s+/g, "").toLowerCase()}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete="off"
          className={className} // Aplica la clase externa si se pasa
        />
        <label htmlFor={placeholder.replace(/\s+/g, "").toLowerCase()}>
          {placeholder}
        </label>{" "}
        {/* Ahora usa el placeholder dinámicamente */}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .inputGroup {
    font-family: "Segoe UI", sans-serif;
    margin: 1em 0;
    width: 100%;
    position: relative;
  }

  /* --- SVG dentro del input usando TU clase --- */
  .iconolabeltarjeta {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  .inputGroup input {
    font-size: 100%;
    padding: 0.8em;
    padding-left: 42px; /* espacio para el SVG */
    outline: none;
    border: 2px solid rgb(200, 200, 200);
    background-color: transparent;
    border-radius: 20px;
    width: 100%;
  }

  .inputGroup label {
    font-size: 100%;
    position: absolute;
    left: 40px;
    padding: 0.8em;
    pointer-events: none;
    transition: all 0.3s ease;
    color: rgb(100, 100, 100);
  }

  .inputGroup :is(input:focus, input:valid) ~ label {
    transform: translateY(-50%) scale(0.9);
    margin-left: 5px;
    padding: 0.4em;
    background-color: #ffffff;
  }

  .inputGroup :is(input:focus, input:valid) {
    border-color: rgb(150, 150, 200);
  }
`;

export default InputSearch;
