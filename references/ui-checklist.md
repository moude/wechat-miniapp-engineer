# UI Checklist

Use this when changing WXML/WXSS, visual components, copy, layout, images, interactions, or responsive behavior.

## Devices

Check at least:

- Narrow phone: iPhone SE-like width or 320-375 CSS px.
- Common phone: iPhone 12/13-like width or 390 CSS px.
- Tall Android or large phone when the page has bottom actions, tabs, maps, media, or long lists.

## Layout

- No overlapping text, icons, buttons, safe-area bars, tabs, fixed bottoms, or modals.
- Text fits its container and wraps intentionally. Long Chinese/English/mixed strings must not clip.
- Fixed bottom actions respect `safe-area-inset-bottom`.
- Empty, loading, error, and permission-denied states match the same layout quality as the happy path.
- Tap targets are large enough for repeated mobile use.

## Images

- Product/content images show the important subject and are not distorted.
- Avatar/logo/icon shapes are intentional and consistent.
- Aspect-ratio wrappers prevent layout shift.
- Missing image fallback is acceptable.
- Network images are HTTPS and domain-valid for production.

## Interaction

- Buttons show disabled/loading states during async actions.
- Duplicate submissions are prevented.
- Destructive actions require confirmation or an undo path when appropriate.
- Form validation appears near the failing field and survives keyboard/open-panel states.
- Pull-down refresh, pagination, tabs, filters, and modal close behavior feel native.

## Visual Quality

- Follow the project's existing design system before adding a new palette or component style.
- Avoid overusing card nesting. In operational pages, keep density and scanability.
- Use consistent spacing, typography scale, and icon style.
- Keep important content visible above the fold when it is the point of the page.

## Screenshot Review

When screenshots are produced, inspect them before final delivery:

- Top safe area/nav title is not clipped.
- Main content starts below navigation and does not hide behind fixed bars.
- Lists do not show half-clipped rows at common heights unless scroll position explains it.
- Modal/popover placement works on narrow widths.
- Empty states do not look like errors unless they are errors.
