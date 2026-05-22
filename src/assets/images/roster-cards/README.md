# Roster card art

Drop **top-of-card** images here for the project picker (`ProjectSelect`).

## Wiring new art

1. Drop the image in this folder.
2. Add an import + entry in `rosterCardImages.ts` (maps project **`id`** → file).

| Project `id` | Suggested filename | Discipline |
|--------------|-------------------|------------|
| `guild` | `Guild of Guardians.png` ✓ | Product Design |
| `rocksmith` | `Rocksmith.png` ✓ | Product Design |
| `login` | `login.png` | UI Design |
| `helldivers` | `helldivers.png` | UI Design |
| `account-tray` | `account-tray.png` | UI Design |
| `sales-modal` | `sales-modal.png` | UI Design |
| `voice-chat` | `voice-chat.png` | UI Design |
| `node-graph` | `node-graph.png` | UI Design |
| `patapon` | `patapon.png` | UI Design |
| `jedi` | `jedi.png` | UI Design |

Projects without a file in `rosterCardImages.ts` still use a procedural placeholder until you add one.

## Layout tips

- Portrait-friendly art works best (~**3:4** or taller); the card crops the top **~60%** with `object-fit: cover`.
- The bottom **~40%** is the title plate (no image) — keep important subject matter in the upper portion.
