import { world, system, EquipmentSlot } from "@minecraft/server";

const ROCKET_ITEM_ID = "rp:rocket";
const OVERWORLD_ID = "minecraft:overworld";

const PLANETS = [
  {
    name: "Earth",
    blockId: "minecraft:grass_block",
    center: { x: 0, y: 220, z: 0 }
  },
  {
    name: "the Moon",
    blockId: "rp:moon_rock",
    center: { x: 3000, y: 220, z: 0 }
  },
  {
    name: "Mars",
    blockId: "rp:mars_rock",
    center: { x: 0, y: 220, z: 3000 }
  }
];

const PLATFORM_RADIUS = 2;

function planetNear(location) {
  return PLANETS.find(
    (planet) =>
      Math.abs(location.x - planet.center.x) <= 8 &&
      Math.abs(location.z - planet.center.z) <= 8 &&
      Math.abs(location.y - planet.center.y) <= 64
  );
}

function buildLandingPad(dimension, planet) {
  const { x, y, z } = planet.center;
  const air = `${x - PLATFORM_RADIUS} ${y} ${z - PLATFORM_RADIUS} ${x + PLATFORM_RADIUS} ${y + 4} ${z + PLATFORM_RADIUS}`;
  const pad = `${x - PLATFORM_RADIUS} ${y - 1} ${z - PLATFORM_RADIUS} ${x + PLATFORM_RADIUS} ${y - 1} ${z + PLATFORM_RADIUS}`;
  dimension
    .runCommandAsync(`fill ${air} air`)
    .then(() => dimension.runCommandAsync(`fill ${pad} ${planet.blockId}`))
    .catch(() => {});
}

function wearRocket(player) {
  const equippable = player.getComponent("minecraft:equippable");
  if (!equippable) return;
  const item = equippable.getEquipment(EquipmentSlot.Mainhand);
  if (!item || item.typeId !== ROCKET_ITEM_ID) return;
  const durability = item.getComponent("minecraft:durability");
  if (!durability) return;
  const nextDamage = durability.damage + 1;
  if (nextDamage >= durability.maxDurability) {
    equippable.setEquipment(EquipmentSlot.Mainhand, undefined);
    player.playSound("random.break");
  } else {
    durability.damage = nextDamage;
    equippable.setEquipment(EquipmentSlot.Mainhand, item);
  }
}

function launch(player, from, to) {
  const dimension = player.dimension;
  buildLandingPad(dimension, to);
  player.teleport(
    { x: to.center.x + 0.5, y: to.center.y, z: to.center.z + 0.5 },
    { dimension, rotation: { x: 0, y: 0 } }
  );
  player.addEffect("slow_falling", 20 * 15, { amplifier: 0, showParticles: false });
  player.onScreenDisplay.setActionBar(`§bLaunched to ${to.name}!`);
  player.playSound("mob.enderdragon.growl");
  try {
    dimension.spawnParticle("minecraft:huge_explosion_emitter", {
      x: from.x,
      y: from.y + 1,
      z: from.z
    });
  } catch (e) {}
  wearRocket(player);
}

world.afterEvents.itemUse.subscribe((event) => {
  const player = event.source;
  if (!player || player.typeId !== "minecraft:player") return;
  if (event.itemStack?.typeId !== ROCKET_ITEM_ID) return;
  if (player.dimension.id !== OVERWORLD_ID) {
    player.onScreenDisplay.setActionBar("§cThe rocket only works in the Overworld.");
    return;
  }
  const current = planetNear(player.location) ?? PLANETS[0];
  const index = PLANETS.indexOf(current);
  const next = PLANETS[(index + 1) % PLANETS.length];
  launch(player, player.location, next);
});

world.afterEvents.worldInitialize.subscribe(() => {
  system.run(() => {
    world.sendMessage(
      "Rocket Planets loaded! Use the Rocket item to travel between Earth, the Moon, and Mars."
    );
  });
});
