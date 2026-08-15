# WYSIWYG QA Matrix — v0.16

| Property | Canvas Editor | Live Preview | Published | Website Card Preview | Result |
|---|---|---|---|---|---|
| Buka Undangan text color | Feature state | Feature state | Feature state | Canvas 01 feature state | PASS contract |
| Buka Undangan content alignment | Feature `align` | Same | Same | Same | PASS contract |
| Buka Undangan object position | `objectAlign` | Same placement helper | Same | Same | PASS contract |
| Buka Undangan content width | `objectWidth` | Same placement helper | Same | Same | PASS contract |
| Cover gradient/background | Feature state | Same | Same | Canvas 01 snapshot renderer | PASS contract |
| Button style/icon | Feature state | Same | Same | Representative miniature | PASS contract |
| Opening animation | Inspector config | Same public renderer | Same | Static thumbnail only | Expected |

## Remaining visual UAT

Source-contract QA cannot replace browser screenshot comparison. Human UAT should still verify Chrome/Edge/Safari/mobile at representative widths, especially long guest names, high-contrast backgrounds, 20–100% content width and reduced-motion behavior.
