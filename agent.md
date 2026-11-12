# Agent Guidelines — Interactive Web

## Project Overview
This repository contains the Interactive Web project, including its website pages, navigation, hero section, and multilingual/voice-based business entry functionality.

Future AI coding agents must work safely, preserve the existing user experience, and make only small, intentional changes.

## Approved Changes
The following changes have been explicitly requested and approved:

1. Change the hero section background to the light color that suits the website’s existing color palette (warm cream #F8F5EF or a subtle light gradient based on that theme).
2. Change the hero section heading from yellow to the website’s existing theme color (primary brand green #158B47 / #18C66A).
3. Ensure the hero heading and text have strong contrast on the light background and remain visually consistent with the website design.
4. Replace the bright yellow color in the multilingual/language section with a light theme color or subtle gradient (soft sage/mint and cream) that matches the website’s existing color palette, updating the section background, cards, and text accents.
5. Remove all yellow colors across the website and do not introduce new colors like brown. All elements, chart expense bars, chart legends, donut chart, tag accents, and headings must strictly use the website's existing theme palette (theme green #158B47 / #18C66A for brand accents and credit, and charcoal var(--ink) #171923 for expenses and dark contrasts).
6. Redesign the navigation bar links and active indicator to match the reference styling (clean typography with bold active link, refined spacing, and a signature downward-curved scoop tab housing a glowing theme-green audio waveform #18C66A). Preserve all existing links, brand mark, structure, functionality, and color theme.
7. Upgrade the Features section (`#features`) to an interactive accordion with Framer Motion expand/collapse animations, sticky left header, mouse-tracking hover spotlight effect, rotate `+` icon, and feature category tags while strictly preserving the website's existing color theme (Cream #FAF8F5, Charcoal #171923, Theme Green #16A34A / #15803D, White), typography, and navigation functionality.
8. Integrate Lenis (`lenis`) for buttery smooth inertia scrolling across the entire page shell, synchronized with GSAP and ScrollTrigger, with smooth anchor delegation for zero layout jitter.
9. Lock in global theme background color #FAF8F5 (warm cream) and emerald accent colors #15803D / #16A34A across all stylesheets and components.
10. Do not make any other visual or functional changes beyond these approved updates.

## Design System
- Preserve the website’s existing theme, branding, color palette, typography, spacing, and layout.
- Do not introduce new colors (such as yellow or brown). All accent elements, chart bars, and indicators must strictly use the website's existing theme palette (Charcoal #171923, Theme Green #18C66A, Cream #F8F5EF, and White).
- Do not introduce new fonts, frameworks, libraries, or major UI styles unless explicitly requested.
- Maintain consistency between the navigation bar, hero section, page sections, buttons, and footer.
- Ensure all UI changes remain responsive on desktop, tablet, and mobile.

## Hero Section
- The hero section may be modified only for the approved changes listed in the “Approved Changes” section.
- The hero section must use the light theme color palette (cream/soft light gradient) that suits the website design.
- Do not revert the hero section to black or dark tones, and do not use yellow for the hero heading.
- Use primary theme green for the hero heading accent and ensure strong text contrast.
- Preserve the hero heading, supporting text, call-to-action elements, and layout.

## Navigation
- The navigation bar links and active indicator match the approved reference styling.
- Active link ("How it works" by default) displays in bold charcoal (#171923), with inactive links in clean medium weight (#373B32) and emerald hover (#158B47).
- A downward-curved scoop tab sits along the navbar's bottom edge under the active link, seamlessly connecting to the bottom border and housing an emerald green audio waveform (#18C66A) with subtle radial green glow.
- Preserve all existing navigation links, dropdowns, mobile menu behavior, functionality, and overall color theme.
- Keep the navigation visually consistent with the rest of the website.

## Multilingual / Voice-Based Business Entry
- Replace the bright yellow background and yellow accents in the language section with the website's light theme palette (soft sage/mint and warm cream).
- Ensure the language section decoration badge and orbital rings have smooth dynamic animation (floating sticker, rotating dashed orbital ring, and pulsing audio indicator) rather than remaining static.
- Preserve existing language options, voice input behavior, form flow, validation, and user feedback.
- Do not remove or replace existing functionality.

## Coding Standards
- Use clean, readable, maintainable code.
- Follow the existing file structure, naming conventions, and coding style.
- Avoid unnecessary dependencies, refactoring, or large-scale changes.
- Make the smallest possible change needed to accomplish the task.
- Avoid changing unrelated files.

## Safe Change Rules
- Inspect relevant files before making changes.
- Confirm the current design and functionality before editing.
- Apply only the requested change.
- Do not redesign pages or introduce breaking changes.
- Do not delete existing content, links, sections, or features.
- Do not add placeholder text, dummy data, or unused code.

## Testing Checklist
Before completing a task, verify that:
- The website loads without errors.
- Navigation links and mobile menu behavior still work.
- The hero section displays correctly and matches the existing theme.
- Existing page sections, buttons, and footer remain functional.
- Multilingual and voice-based business entry features remain intact.
- The layout remains responsive on desktop, tablet, and mobile.
- No new console errors are introduced.

## Agent Workflow
1. Inspect the repository and identify the files related to the requested task.
2. Review the existing design, structure, and functionality.
3. Identify the smallest safe change required.
4. Apply the change.
5. Review the modified files.
6. Confirm that no unrelated files or features were changed.
7. Summarize the files modified, the reason for the change, and the testing performed.
