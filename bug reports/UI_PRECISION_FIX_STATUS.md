# UI precision update — running issue ledger

These issues belong to the new browser update. The original independent QA ledger remains in [FIX_STATUS.md](FIX_STATUS.md); its regression cases are retained. No native installer or release is updated here.

| ID | Defect and reproduction | Root cause / fix | Verification status |
| --- | --- | --- | --- |
| UI-01 | Character accessories face the camera when rotated | Old accessory layers ignored facing and were drawn more than once. One directional accessory pass now supplies front/side/back geometry. | Fixed: `accessories.cjs`; four-direction visual sheet; side hat/scarf width assertions |
| UI-02 | Change trouser colour, face left/right: old colour remains | Side-leg fill used a hardcoded colour. Both side poses use profile trousers. | Fixed: `character-details.cjs`, both facings |
| UI-03 | Change player clothes/face: villagers inherit some choices | NPC renderer spread the player profile. Each villager now has its own cached validated profile. | Fixed: all nine NPC images remain identical before/after player changes |
| UI-04 | Soft and straight eyebrow choices look identical | Half-grid rounding collapsed both line heights. Straight brows now use a distinct heavier stroke. | Fixed: all 45 non-default appearance variants change actual artwork |
| UI-05 | Expanded default pupils lose opaque colour at native sprite scale | Subpixel pupil dimensions/anchors produced blended pixels. Pupil core uses an integer-aligned pixel; finer surrounding details remain. | Fixed: original four-direction/six-frame eye stability assertions in `expansion.cjs` |
| UI-06 | Journal page-turn buttons leave a short landscape window | Wrapped navigation and fixed minimum page height exceeded the popup budget. Navigation uses a scrollable row on short screens; page height reserves measured footer space. | Fixed: original 844×390 `book-storage.cjs` reproduction; six-size audit |
| UI-07 | Journal folios overlap text while page content scrolls | Absolute folios remained pinned over long content. Folios now flow and scroll with their page. | Fixed: audit asserts folio/previous-content separation; phone picture reviewed |
| UI-08 | Larger quantity labels make phone hotbar 62px high | Larger slots stacked with old bar padding/border. Phone slots/footer and bar padding now share one 52px total height. | Fixed: original portrait/landscape bound, slot overflow, touch swipe and quantity tests |
| UI-09 | Legend covers its own toggle after desktop minimap grows | Enlarged minimap moved the toggle into the legend's previous rectangle. Legend now opens above toggle/map. | Fixed: original two-click open/close and atlas flow in `expansion.cjs` |
| UI-10 | Small landscape controller label overlaps waypoint | Raised transient label entered the existing waypoint rectangle. Restored spacing compatible with the compact bar. | Fixed: eight generic-controller A/C phone/tablet variants |
| UI-11 | Legacy long hairstyle migrates to short hair length | Merging defaults before profile migration supplied a new default length too early. Normalize original profile before deriving missing fields. | Fixed: legacy long profile migration and repeat validation |
| UI-12 | An old home's furnishing can occupy the proposed starter-mirror tile | Unconditional mirror insertion overlapped existing possessions. Search clear home tiles/approaches; use furniture storage only if no suitable tile remains. | Fixed: occupied-tile legacy fixture; existing decoration position and single mirror retained |
| UI-13 | Internal chapter labels and developer sidebar buttons clip | Flex/grid shrink exceeded readable intrinsic sizes. Use intrinsic chapter height and non-shrinking sidebar controls. | Fixed: all six viewport audits |
| UI-14 | Phone furnishing placement labels remain 9px despite larger text | Redundant `.row` class matched an older, more-specific selector. Removed that class from the dedicated action grid. | Fixed: audit minimum control size/text bounds and touch furnishing tests |
| UI-15 | Blueprint heading has poor contrast | Older header colour survived new panel styling. Blueprint header explicitly inherits its light theme ink. | Fixed: desktop blueprint screenshot and themed audit |

| UI-16 | Hotbar icons occupy too little of their containers | Small display sizes compounded transparent sprite margins. Crop/fill hotbar artwork only; larger tool-only canvases preserve the count footer and bar footprint. | Fixed: before/after visible bounds, 186 UI/quantity cases and 14 A/C layouts pass |

## Fixed requested behavior

Physical mirror access, draft Save/Cancel, a centred safe phone editor, expanded detail fields, controls below the atlas, clear waypoint, real TV forecasts, themed non-book menus, desktop minimap sizing, safe quantities and isolated developer commands are implemented and receive automated coverage. Native font data is unchanged.

## Unresolved / pending review

- Map/TV design feedback, physical-device layout/performance, real-controller compatibility and audible-output review.
- Native app rollout is intentionally on hold. Existing binaries do not contain this update.
- Alternate engines, every possible farm arrangement and long natural play sessions are not certified by the finite matrix.

No confirmed P0/P1 issue was newly discovered in this UI pass. The above integration defects were repaired at their rendering, layout or migration causes; assertions were not weakened to conceal them. Test selector/background fixtures were adapted only to deliberate UI changes. Full test scope and limitations: [UI_PRECISION_REVIEW.md](../UI_PRECISION_REVIEW.md).
