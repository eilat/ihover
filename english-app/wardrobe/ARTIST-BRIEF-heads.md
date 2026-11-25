# Midnight Misfits: separate heads and expressions (test with Pumpkin first)

Hi! The wardrobe is working with your art, and breathing, wing flaps and a whole-body move per character are already in. For the face moves (eye roll, wink, tongue, yawn and so on) and head tilts, we need the head as its own layer. Please start with **Pumpkin only**, so we can check how it looks before doing all four.

## 1. The body without a head
- `body_pumpkin.png`: the current base with the head and hair removed. The neck stays and runs a little further down, so it can hide under any collar.
- Same canvas as now: transparent PNG, 1000 x 2000, same position. All existing clothes must still fit without changes.

## 2. The head as its own layer
- `head_pumpkin_neutral.png`: head, hair, ears and the top of the neck. Same 1000 x 2000 canvas, in exactly the place it sits now.
- Please mark the pivot point (where the head turns on the neck): a small dot in a separate file, `head_pumpkin_pivot.png`, or just write the x,y pixel position.
- If the hair has a part that falls behind the shoulders, put it in a separate `hair-back_pumpkin.png`, so it can sit behind the body and the dress.

## 3. Expressions (head only, same size and position as neutral)
Two to four frames per expression, from start to peak. Each frame is the whole head.
- **Tongue out:** `head_pumpkin_tongue_1.png`, `_2.png`, `_3.png`
- **Wild laugh:** `head_pumpkin_laugh_1.png`, `_2.png` (mouth wide open, eyes squeezed shut)
- **Blink:** `head_pumpkin_blink_1.png` (eyes half closed), `_2.png` (closed)

The blink goes for every character later; it keeps them alive between the big moves.

## 4. Rules that stay true for all future clothes
- Dresses, tops and capes draw nothing above the collar line, so the head can move freely.
- Anything that sits on the head (hats, glasses, earrings, braids) stays its own layer, as now. It will move together with the head.
- No arm poses are needed. Moth adjusting her glasses will be done with the glasses alone, with a little hop.

## 5. Later, for the other three (after Pumpkin is approved)
- Raven: eye roll, yawn, raised eyebrow
- Moth: slow blink, nose wrinkle
- Luna: wink, sly smile
- Wings: left and right wing as two separate layers, each with its root at the back (now I cut them in half myself)

Thank you!
