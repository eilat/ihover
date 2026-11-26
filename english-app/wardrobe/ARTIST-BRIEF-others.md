# Midnight Misfits: Raven, Moth and Luna animation kits

Pumpkin works beautifully in the wardrobe: the body and head layers, the neck pivot, the tongue, laugh and blink frames all fit, and hats, glasses and earrings move with the head with no changes. Please make the same kit for the other three, following exactly the Pumpkin structure and naming.

## For each character (raven, moth, luna)

**Same canvas as always:** transparent PNG, 1000 x 2000, every layer in the same position as the current base. All existing clothes must still fit unchanged.

1. `body_<name>.png`: the current base with the head and hair removed. The neck continues a little further down, so it stays covered under any collar when the head tilts ±5°.
2. `head_<name>_neutral.png`: head, front hair, ears and the top of the neck, exactly where they sit now.
3. `hair-back_<name>.png`: any hair that falls behind the neck and shoulders. It sits behind the body and the dress and does not turn with the head. This matters for these three:
   - **Raven:** the long spiky strands behind the shoulders.
   - **Luna:** the long wavy hair that falls behind her back.
   - **Moth:** anything behind the braids, if needed.
   Hair that hangs in front of the shoulders stays on the head layer. Keep it short enough that it won't cut into the dress when the head tilts ±5°.
4. The head pivot point for each character, as x,y pixels (as you gave for Pumpkin: 500, 669), in `pivot.json`.
5. **Expression frames:** head only, same size and position as neutral, each frame a whole head.

| Character | Expression | Frames | Sequence |
|---|---|---|---|
| Raven | Eye roll | `eyeroll_1`, `_2`, `_3` (pupils move up and around) | neutral → 1 → 2 → 3 → 2 → neutral |
| Raven | Yawn | `yawn_1`, `_2` (mouth wide, eyes squeezed) | neutral → 1 → 2 (hold) → 1 → neutral |
| Raven | Raised eyebrow | `brow_1` (one brow up, a little smirk) | neutral → 1 (hold) → neutral |
| Moth | Slow blink | `slowblink_1`, `_2`, `_3` (heavy lids closing slowly) | neutral → 1 → 2 → 3 → 2 → 1 → neutral |
| Moth | Nose wrinkle | `nose_1`, `_2` (nose scrunched, eyes narrowed) | neutral → 1 → 2 (hold) → 1 → neutral |
| Luna | Wink | `wink_1`, `_2` (one eye half closed, then closed) | neutral → 1 → 2 → 1 → neutral |
| Luna | Sly smile | `sly_1`, `_2` (eyes narrowed sideways, side smile) | neutral → 1 → 2 (hold) → 1 → neutral |
| All three | Blink | `blink_1` (half closed), `blink_2` (closed) | neutral → 1 → 2 → 1 → neutral |

File names follow Pumpkin's: `head_raven_eyeroll_1.png`, `head_luna_blink_2.png`, and so on.

## Points to keep in mind
- **Eyes stay in place in every frame.** Round glasses and moon earrings are wardrobe layers on top of the head, so the eyes and ears must not move between frames, only the lids, pupils, brows and mouth. This matters most for Moth, whose glasses "adjust" by hopping up a little during the nose wrinkle.
- **No arms, no body poses.** All body motion (sway, float, nod, stomp) is done in code.
- **Wings, if you have time:** each of the four wing pairs (bat, moth, cobweb, dragonfly) as two layers, `wings_<name>_L.png` and `wings_<name>_R.png`, each with its root at the centre of the back. For now I cut them in half myself, and a clean split would flap better.
- A preview sheet of all expressions per character, like Pumpkin's `expressions.png`, helps a lot for the check.
- A short README per character, like Pumpkin's, with layer order and pivot.

## Order
Raven first, then Luna, then Moth, uploaded to a folder per character, like `Pumpkin Animation`. Each one goes into the wardrobe as soon as it arrives.

Thank you!
