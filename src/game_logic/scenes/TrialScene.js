import Phaser from "phaser";

export default class TrialScene extends Phaser.Scene {
  constructor() {
    super("TrialScene");
  }

  preload() {
    this.load.image("hero", "/hero.png");
  }

  create() {
    const { width, height } = this.scale;

    // ─── Background (simple dark chamber) ───
    this.cameras.main.setBackgroundColor("#05080d");

    // ─── Hero ───
    this.hero = this.add.image(width / 2, height - 220, "hero");
    this.hero.setScale(0.6);

    // ─── Sage (simple hologram circle) ───
    this.sage = this.add.circle(width / 2, 180, 40, 0x00ffff, 0.4);

    this.tweens.add({
      targets: this.sage,
      y: "+=10",
      yoyo: true,
      repeat: -1,
      duration: 1200,
      ease: "Sine.easeInOut",
    });

    // ─── Sage Dialogue ───
    this.dialogue = this.add.text(
      width / 2,
      260,
      "Power without understanding always collapses.\nChoose how you think.",
      {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#7fffd4",
        align: "center",
      }
    ).setOrigin(0.5);

    // ─── Choices (IN-WORLD, NOT UI) ───
    this.choices = [
      {
        key: "ONE",
        label: "1 — Force through the problem",
        quality: "brute",
        x: width / 2 - 220,
      },
      {
        key: "TWO",
        label: "2 — Analyze and optimize",
        quality: "smart",
        x: width / 2,
      },
      {
        key: "THREE",
        label: "3 — Destroy and rebuild",
        quality: "reckless",
        x: width / 2 + 220,
      },
    ];

    this.choiceTexts = this.choices.map((c) =>
      this.add.text(c.x, height / 2 + 40, c.label, {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#00cccc",
        align: "center",
      }).setOrigin(0.5)
    );

    // Pulse choices
    this.choiceTexts.forEach((text) => {
      this.tweens.add({
        targets: text,
        alpha: 0.3,
        yoyo: true,
        repeat: -1,
        duration: 900,
      });
    });

    // ─── Input ───
    this.keys = this.input.keyboard.addKeys("ONE,TWO,THREE");
    this.chosen = false;
  }

  update() {
    if (this.chosen) return;

    if (Phaser.Input.Keyboard.JustDown(this.keys.ONE)) {
      this.selectChoice(0);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.TWO)) {
      this.selectChoice(1);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.THREE)) {
      this.selectChoice(2);
    }
  }

  selectChoice(index) {
    this.chosen = true;
    const choice = this.choices[index];

    // Save weapon logic
    localStorage.setItem("weaponQuality", choice.quality);

    // Fade out other choices
    this.choiceTexts.forEach((text, i) => {
      if (i !== index) {
        this.tweens.add({
          targets: text,
          alpha: 0,
          duration: 300,
        });
      }
    });

    // Highlight selected
    this.choiceTexts[index].setColor("#ffffff");

    // ─── Weapon Energy Forms ───
    const weaponEnergy = this.add.rectangle(
      this.hero.x + 40,
      this.hero.y - 40,
      8,
      60,
      0x00ffcc
    ).setAlpha(0);

    this.tweens.add({
      targets: weaponEnergy,
      alpha: 1,
      scaleY: 1.6,
      duration: 600,
      ease: "Power2",
    });

    // Screen feedback
    this.cameras.main.flash(200, 0, 255, 200);
    this.cameras.main.shake(300, 0.01);

    // Sage reacts
    this.dialogue.setText("Your weapon reflects your mind.");

    // End scene (placeholder)
    this.time.delayedCall(1600, () => {
this.scene.start("GameScene");

      // this.scene.start("GameScene");
    });
  }
}
