import React from "react";
import styled from "styled-components";

export default function Checkbox({ checked, onChange, label, id }) {
  return (
    <StyledWrapper>
      <label className="checkbox-container" htmlFor={id}>
        <input
          id={id}
          className="custom-checkbox"
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <span className="checkmark" />
        <span className="checkbox-label">{label}</span>
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .checkbox-container {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    cursor: pointer;
    font-size: 16px;
    user-select: none;
  }

  .custom-checkbox {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: relative;
    height: 22px;
    width: 22px;
    background-color: #eee;
    border-radius: 4px;
    transition: background-color 0.3s;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
    left: 7px;
    top: 4px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }

  .custom-checkbox:checked ~ .checkmark {
    background-color: #b30000;
    box-shadow: 0 3px 7px rgba(243, 33, 33, 0.3);
  }

  .custom-checkbox:checked ~ .checkmark:after {
    display: block;
    animation: checkAnim 0.2s forwards;
  }

  .checkbox-label {
    color: #333;
  }

  @keyframes checkAnim {
    0% {
      height: 0;
    }
    100% {
      height: 10px;
    }
  }
`;
