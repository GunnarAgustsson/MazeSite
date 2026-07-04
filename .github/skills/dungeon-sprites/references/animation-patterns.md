# Sprite Animation Patterns

## Player idle bob

Use a tiny `animateTransform` translate loop:

- Duration: `0.5s` to `0.9s`
- Amplitude: `1px`
- Values: `0 0;0 -1;0 0`

## Torch / brazier flicker

Use 2-frame or 3-frame SMIL loops:

- Animate `height`, `y`, or `opacity`
- Keep loop around `0.2s` to `0.3s`
- Vary outer and inner flame blocks independently

## Cloth sway (optional)

Use slow translation/rotation for banners:

- Duration: `2.0s` to `3.0s`
- Motion: `0px` to `1px` horizontal or `-1deg` to `1deg`

Avoid animating rubble/stone/static clutter.
