/*"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(
  () => import("../../components/GameCanvas"),
  { ssr: false }
);

export default function IntroPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Phaser Canvas *}
      <GameCanvas />

      {/* UI Overlay *}
      <div className="absolute bottom-20 w-full flex justify-center">
<button className="
  px-10 py-4
  text-lg font-semibold tracking-wide
  text-black bg-emerald-400
  rounded-md
  shadow-[0_0_20px_rgba(16,185,129,0.7)]
  hover:shadow-[0_0_30px_rgba(16,185,129,1)]
  transition-all duration-300
">
  ▶ START JOURNEY
</button>

      </div>
    </div>
  );
}
*/


import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {

    this.load.tilemapTiledJSON("townMap", "assets/maps/cityMap.json");
    this.load.image("townTiles", "assets/images/galletcity_tiles.png");

    this.load.image("hero", "/hero.png");
    this.load.image("enemy", "/enemy.png");
    this.load.image("slash", "/slash.png");
  }

  create() {

    const map = this.make.tilemap({ key: "townMap" });

    const tileset = map.addTilesetImage(
      "galletcity_tiles8",
      "townTiles"
    );


    const ground = map.createLayer("SideWalk", tileset, 0, 0);
    const roads = map.createLayer("Roads", tileset, 0, 0);
    const buildings = map.createLayer("Buildings", tileset, 0, 0);

    const collision = map.createLayer("Collision", tileset, 0, 0);
    collision.setCollisionByProperty({ collides: true });


    const playerSpawn = map.findObject(
      "Player",
      obj => obj.name === "playerSpawn"
    );

    this.player = this.physics.add.sprite(
      playerSpawn.x,
      playerSpawn.y,
      "player"
    );

    this.enemies = this.physics.add.group();

    const enemyObjects = map.getObjectLayer("Enemies")?.objects || [];

    enemyObjects.forEach(obj => {
      const enemy = this.enemies.create(obj.x, obj.y, obj.type);
      enemy.name = obj.name;
    });



    this.npcs = this.physics.add.staticGroup();

    const npcObjects = map.getObjectLayer("NPC")?.objects || [];

    npcObjects.forEach(obj => {
      const npc = this.npcs.create(obj.x, obj.y, obj.type);
      npc.name = obj.name;
    });


    this.gates = this.physics.add.staticGroup();

    const gateObjects = map.getObjectLayer("SageGate")?.objects || [];

    gateObjects.forEach(obj => {
      const gate = this.gates.create(obj.x, obj.y, null);
      gate.toMap = obj.properties?.find(p => p.name === "to")?.value;
    });


    this.physics.add.collider(this.player, collision);
    this.physics.add.collider(this.enemies, collision);
    this.physics.add.collider(this.player, this.enemies);

    this.physics.add.overlap(this.player, this.npcs, this.onNpcTalk, null, this);
    this.physics.add.overlap(this.player, this.gates, this.onEnterGate, null, this);


    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels
    );


    this.events.on("update", () => {
      this.player.setDepth(this.player.y);
      this.enemies.children.iterate(e => e?.setDepth(e.y));
      this.npcs.children.iterate(n => n?.setDepth(n.y));
    });


    /*

    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#0a0f14");

    // ─── ENEMY (LEFT) ───
    this.enemy = this.add.image(width / 2 - 220, height - 220, "enemy");
    this.enemy.setScale(0.6);
    this.enemy.setFlipX(false); // faces right

    // ─── HERO (RIGHT) ───
    this.hero = this.add.image(width / 2 + 220, height - 220, "hero");
    this.hero.setScale(0.6);
  this.hero.setFlipX(false);


    this.heroHP = 100;

    // ─── ENEMY HP ───
    this.maxHP = 100;
    this.enemyHP = this.maxHP;

    this.hpBg = this.add.rectangle(
      this.enemy.x,
      this.enemy.y - 90,
      80,
      8,
      0x222222
    );

    this.hpBar = this.add.rectangle(
      this.enemy.x - 40,
      this.enemy.y - 90,
      80,
      8,
      0x00ff55
    ).setOrigin(0, 0.5);

    // ─── WEAPON STATS ───
    const quality = localStorage.getItem("weaponQuality") || "brute";
    this.weaponStats = this.getWeaponStats(quality);

    // ─── INPUT ───
    this.attackKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.canAttack = true;
    this.enemyAlive = true;
  }

  update() {
    if (
      Phaser.Input.Keyboard.JustDown(this.attackKey) &&
      this.canAttack &&
      this.enemyAlive
    ) {
      this.attackEnemy();
    }
  }

  // ───────── HERO ATTACK ─────────
  attackEnemy() {
    this.canAttack = false;

    // Slash effect (right → left)
    const slash = this.add.image(
      this.enemy.x + 40,
      this.enemy.y,
      "slash"
    );
    slash.setScale(0.7);
    slash.setAlpha(0.8);
    slash.setFlipX(true);

    this.tweens.add({
      targets: slash,
      x: slash.x - 60,
      alpha: 0,
      duration: 200,
      onComplete: () => slash.destroy(),
    });

    const dmg = this.weaponStats.damage;
    this.enemyHP -= dmg;

    this.showDamage(dmg);
    this.updateHPBar();
    this.enemyHitReaction();

    if (this.enemyHP <= 0) {
      this.killEnemy();
      return;
    }

    // Enemy attacks back
    this.time.delayedCall(500, () => {
      if (this.enemyAlive) this.enemyAttack();
    });

    this.time.delayedCall(this.weaponStats.cooldown, () => {
      this.canAttack = true;
    });
  }

  // ───────── DAMAGE NUMBER ─────────
  showDamage(dmg) {
    const text = this.add.text(
      this.enemy.x,
      this.enemy.y - 120,
      `-${dmg}`,
      {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#ff5555",
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      y: text.y - 30,
      alpha: 0,
      duration: 600,
      onComplete: () => text.destroy(),
    });
  }

  updateHPBar() {
    const hpPercent = Phaser.Math.Clamp(this.enemyHP / this.maxHP, 0, 1);
    this.hpBar.width = 80 * hpPercent;
  }

  enemyHitReaction() {
    this.cameras.main.shake(120, 0.008);

    this.tweens.add({
      targets: this.enemy,
      x: this.enemy.x - 12,
      yoyo: true,
      repeat: 1,
      duration: 60,
    });

    this.enemy.setTint(0xffffff);
    this.time.delayedCall(80, () => this.enemy.clearTint());
  }

  // ───────── ENEMY ATTACK ─────────
  enemyAttack() {
    this.cameras.main.shake(200, 0.02);

    const hit = this.add.text(
      this.hero.x,
      this.hero.y - 100,
      "-10",
      {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#ff3333",
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: hit,
      y: hit.y - 20,
      alpha: 0,
      duration: 500,
      onComplete: () => hit.destroy(),
    });

    this.heroHP -= 10;
    console.log("Hero HP:", this.heroHP);
  }

  // ───────── ENEMY DEATH ─────────
  killEnemy() {
    this.enemyAlive = false;

    this.tweens.add({
      targets: [this.enemy, this.hpBar, this.hpBg],
      alpha: 0,
      duration: 400,
    });

this.time.delayedCall(1000, () => {
  this.scene.start("EnemyDialogueScene");
});

  }

  // ───────── WEAPON STATS ─────────
  getWeaponStats(quality) {
    switch (quality) {
      case "smart":
        return { damage: 20, cooldown: 300 };
      case "reckless":
        return { damage: 35, cooldown: 700 };
      default:
        return { damage: 25, cooldown: 500 };
    }*/
  }
}
