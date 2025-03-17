import React, { Fragment } from 'react'

const loaderStyle = {
  background:
    "no-repeat linear-gradient(#FF0600 0 0), no-repeat linear-gradient(#FF0600 0 0), #f0cccc",
  backgroundSize: "60% 100%",
  animation: "l16 3s infinite",
  borderRadius: "24px",
};

const keyframes = `
  @keyframes l16 {
    0%   {background-position:-150% 0,-150% 0}
    66%  {background-position: 250% 0,-150% 0}
    100% {background-position: 250% 0, 250% 0}
  }
`;

export default function Loader() {
  return (
    <Fragment>
      <style>{keyframes}</style>
      <div className="mt-6 h-1 w-80" style={loaderStyle}></div>
    </Fragment>
  );
}
