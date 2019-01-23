/* eslint-disable */
import React from 'react';

export default function EthIcon(props) {
  return (
    <svg width={43} height={43} viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...props}>
      <circle cx="21.5" cy="21.5" r="21.5" fill="url(#paint0_linear_eth-icon)" fillOpacity="0.6" />
      <path d="M13 8H30V35H13V8Z" fill="url(#pattern0)" />
      <defs>
        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width={1} height={1}>
          <use xlinkHref="#image0EthIcon" transform="translate(0 -0.0162963) scale(0.008 0.00503704)" />
        </pattern>
        <linearGradient id="paint0_linear_eth-icon" x1={43} y1="0.548799" x2={43} y2={43} gradientUnits="userSpaceOnUse">
          <stop stopColor="#37B06F" />
          <stop offset={1} stopColor="#294C73" />
        </linearGradient>
        <image id="image0EthIcon" width={125} height={205} xlinkHref="data:image/png;base64,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" />
      </defs>
    </svg>
  );
}
