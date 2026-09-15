import { useEffect, useRef, useState } from 'react'

// Outline of the artwork panel: a rounded card with the same wide, shallow step
// cut out of the top-right and the bottom-left corner, so the shape reads as
// point-symmetric about its centre. The step is sized as a fraction of the
// panel's own box, so it keeps its proportions at any viewport size.
const SHAPE = {
  radius: 40, // outer, convex corners
  fillet: 32, // inner, concave corners
  notch: { w: 0.28, h: 0.095 },
}

function notchPath(w, h, s) {
  const nw = s.notch.w * w
  const nh = s.notch.h * h

  const r = Math.min(s.radius, w / 2, h / 2)
  // Dropping into a step turns a square corner and then a reflex one, so both
  // radii have to fit inside the step's shallow height.
  const sr = Math.min(r, nh * 0.55)
  const sf = Math.min(s.fillet, nh - sr)

  const arc = (rad, sweep, x, y) => `A${rad} ${rad} 0 0 ${sweep} ${x} ${y}`

  return [
    `M${r} 0`,
    // Top edge, then round down into the top-right step: a square corner on the
    // way in, a concave fillet where the drop meets the shelf.
    `L${w - nw - sr} 0`, arc(sr, 1, w - nw, sr),
    `L${w - nw} ${nh - sf}`, arc(sf, 0, w - nw + sf, nh),
    // Across the shelf and round into the right edge.
    `L${w - r} ${nh}`, arc(r, 1, w, nh + r),
    // Right edge, all the way down to the bottom-right corner.
    `L${w} ${h - r}`, arc(r, 1, w - r, h),
    // Bottom edge, then up into the bottom-left step: the same step again,
    // turned through 180 degrees.
    `L${nw + sr} ${h}`, arc(sr, 1, nw, h - sr),
    `L${nw} ${h - nh + sf}`, arc(sf, 0, nw - sf, h - nh),
    // Across that shelf and back onto the left edge.
    `L${r} ${h - nh}`, arc(r, 1, 0, h - nh - r),
    `L0 ${r}`, arc(r, 1, r, 0),
    'Z',
  ].join(' ')
}

// clip-path: path() takes pixels, so the outline is rebuilt whenever the panel
// is resized. That keeps the corner radii circular instead of stretching with
// the box, which an objectBoundingBox clip would do.
export default function NotchedPanel({ className = '', children, ...rest }) {
  const ref = useRef(null)
  const [size, setSize] = useState(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Before the first measurement, fall back to plain rounded corners so the
  // panel never flashes as a bare rectangle.
  const style =
    size && size.width > 0 && size.height > 0
      ? { clipPath: `path('${notchPath(size.width, size.height, SHAPE)}')` }
      : { borderRadius: SHAPE.radius }

  return (
    <div ref={ref} className={className} style={style} {...rest}>
      {children}
    </div>
  )
}
