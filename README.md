# Rocket Planets 🚀

A Minecraft Bedrock Edition add-on that lets you launch between planets with a Rocket item.

## Features

- **Rocket item** (`rp:rocket`) — use it in the Overworld to launch to the next planet.
- **Three planets** — Earth, the Moon, and Mars. Each launch builds a landing pad and cycles you to the next destination, with slow falling so you land safely.
- **Moon Rock** (`rp:moon_rock`) and **Mars Rock** (`rp:mars_rock`) blocks — used as landing pad surfaces, available in the creative menu.
- The rocket has durability (64 launches) and breaks when used up.

## Installation

1. Download `rocket-planets.mcaddon` (or the packed `RP`/`BP` folders).
2. Open the `.mcaddon` file with Minecraft Bedrock Edition — it imports both packs automatically.
3. In your world settings, enable **Rocket Planets BP** (behavior pack) and **Rocket Planets RP** (resource pack).
4. Enable the **Beta APIs** experiment for the launch script.
5. Get a rocket with: `/give @s rp:rocket`

## Requirements

- Minecraft Bedrock Edition **1.20+**
- **Beta APIs** experiment enabled in world settings

## Project layout

```
BP/  Behavior pack  — manifest, rocket item, planet blocks, launch script (@minecraft/server)
RP/  Resource pack  — manifest, item/block textures, language files
```

## License

MIT
