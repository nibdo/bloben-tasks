import React from 'react';

const ChevronLeft = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={props.className}
  >
    <g data-name="Layer 2">
      <g data-name="chevron-left">
        <rect width="24" height="24" transform="rotate(90 12 12)" opacity="0" />
        <path d="M13.36 17a1 1 0 0 1-.72-.31l-3.86-4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.42 1.42L10.9 12l3.18 3.3a1 1 0 0 1 0 1.41 1 1 0 0 1-.72.29z" />
      </g>
    </g>
  </svg>
);

export default ChevronLeft;
