import React, { useState } from "react";


import { isFunction } from '../../../tools/is';

import "./Navbar.css";

/**
 * Navbar component for rendering a selectable navigation bar
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.visible=true] - Controls the visibility of the navbar
 * @param {string|number} [props.defaultSelected] - The default selected option value (uncontrolled mode)
 * @param {string|number} [props.selected] - The currently selected option value (controlled mode)
 * @param {function} [props.onSelectChange] - Callback fired when the selected option changes (required in controlled mode)
 * @param {Array<{ value: string|number, content: React.ReactNode, name: string }>} props.options - Array of navigation options
 * @returns {JSX.Element} The rendered Navbar component
 * 
 * @remarks
 * CSS variables:
 * - `--app-safearea-padding-top`: Padding for safe area at the top, default is `env(safe-area-inset-top)`
 * - `--app-navbar-item-height`: Height of the navbar items, default is `3.5em`
 * - `--app-navbar-z-index`: Z-index for the navbar, default is `20`
 * - `--app-navbar-width`: Width of the navbar, default is `80%`
 * 
 * When the navbar is visible it gets a `data-state="open"` attribute. When an item is selected, it gets a `data-state="selected"` attribute.
 */
const Navbar = ({ visible = true, defaultSelected, selected, onSelectChange, options }) => {
  const isControlled = selected !== undefined;
  const [internalSelected, setInternalSelected] = useState(defaultSelected || options[0]?.value);
  const currentSelected = isControlled ? selected : internalSelected;

  if (isControlled)
    console.assert(isFunction(onSelectChange), "Navbar: onSelectChange must be a function when using controlled mode");

  const handleSelectChange = value => isControlled ? onSelectChange(value) : setInternalSelected(value);

  return (
    <nav
      className='navbar'
      data-state={visible ? 'open' : 'closed'}
    >
      <ul className="navbar-row">

        {options.map(({ value, content, name }, idx) => (
          <li
            key={idx}
            className='navbar-item'
            data-state={currentSelected === value ? 'selected' : 'not-selected'}
            aria-label={name}
            onClick={() => handleSelectChange(value)}
          >
            <span className="navbar-content">
              {content}
            </span>
          </li>
        ))}

      </ul>
    </nav>
  );
};

export default Navbar;