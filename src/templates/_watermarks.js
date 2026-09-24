function logoMark({ x, y, opacity = 0.18, markFill, accentFill, bgFill, textFill, accentTextFill, idSuffix = 'wm' }) {
  return `<g transform="translate(${x}, ${y})" opacity="${opacity}">
    <defs>
      <clipPath id="logoClip_${idSuffix}">
        <rect width="36" height="36" rx="8" ry="8"/>
      </clipPath>
    </defs>
    <rect width="36" height="36" rx="8" fill="${markFill}"/>
    <rect width="36" height="3" fill="${accentFill}" clip-path="url(#logoClip_${idSuffix})"/>
    <g transform="translate(6.75, 9) scale(1.40625)" fill="${bgFill}">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </g>
    <text x="44" y="16" font-family="'Manrope', sans-serif" font-weight="700" font-size="13" fill="${textFill}" letter-spacing="-0.3">GitHub Card</text>
    <text x="44" y="31" font-family="'Manrope', sans-serif" font-weight="800" font-size="13" fill="${accentTextFill}" letter-spacing="-0.3">Creator</text>
  </g>`;
}

function ghostMark({ x, y, scale = 25, opacity = 0.06, fill }) {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" opacity="${opacity}" fill="${fill}">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </g>`;
}

module.exports = { logoMark, ghostMark };
