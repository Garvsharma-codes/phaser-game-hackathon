import Phaser from "phaser";

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }

  preload() {
    this.load.image("cityBack", "/city-back.png");
    this.load.image("cityMid", "/city-mid.png");
    this.load.image("cityFront", "/city-front.png");
    this.load.image("hero", "/hero.png");
  }

  create() {
    const { width, height } = this.scale;

    // ─────────────────────────────────────
    // BACKGROUNDS (PARALLAX LAYERS)
    // ─────────────────────────────────────
    this.bgBack = this.add.image(0, 0, "cityBack").setOrigin(0).setAlpha(0.3);
    this.bgMid = this.add.image(0, 0, "cityMid").setOrigin(0).setAlpha(0.7);
    this.bgFront = this.add.image(0, 0, "cityFront").setOrigin(0);

    [this.bgBack, this.bgMid, this.bgFront].forEach(bg => {
      bg.displayWidth = width;
      bg.displayHeight = height;
    });

    // ─────────────────────────────────────
    // HERO SILHOUETTE (STATIC, CENTERED)
    // ─────────────────────────────────────
    this.hero = this.add.image(width / 2, height - 220, "hero");
    this.hero.setScale(0.6);

    // ─────────────────────────────────────
    // TITLE + STORY TEXT
    // ─────────────────────────────────────
    this.title = this.add.text(width / 2, height / 2 - 160, "CYBER CITY", {
      fontFamily: "monospace",
      fontSize: "42px",
      color: "#00ffd5",
    }).setOrigin(0.5).setAlpha(0);

    this.storyTexts = [
      "The night it fell…",
      "the sky didn’t burn.",
      "It glitched.",
    ].map((line, i) =>
      this.add.text(width / 2, height / 2 - 80 + i * 36, line, {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#00c2a8",
      }).setOrigin(0.5).setAlpha(0)
    );

    // Fade text in
    this.tweens.add({
      targets: this.title,
      alpha: 1,
      duration: 1000,
      ease: "Power2",
    });

    this.storyTexts.forEach((text, i) => {
      this.tweens.add({
        targets: text,
        alpha: 1,
        delay: 800 + i * 500,
        duration: 800,
        ease: "Power2",
      });
    });

    // ─────────────────────────────────────
    // SPACE KEY PROMPT
    // ─────────────────────────────────────
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.cutsceneTriggered = false;

    this.hintText = this.add.text(
      width / 2,
      height - 120,
      "PRESS SPACE",
      {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#00ffd5",
      }
    ).setOrigin(0.5).setAlpha(0.8);

    // Pulse animation
    this.tweens.add({
      targets: this.hintText,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      duration: 700,
    });
  }

  update() {
    if (
      Phaser.Input.Keyboard.JustDown(this.spaceKey) &&
      !this.cutsceneTriggered
    ) {
      this.startGlitchCutscene();
    }
  }

  // ─────────────────────────────────────
  // GLITCH CUTSCENE
  // ─────────────────────────────────────
  startGlitchCutscene() {
    this.cutsceneTriggered = true;

    // Remove hint
    this.hintText.destroy();

    // Screen shake
    this.cameras.main.shake(600, 0.02);

    // Flash
    this.cameras.main.flash(300, 0, 255, 200);

    // Glitch jitter on background
    this.tweens.add({
      targets: [this.bgBack, this.bgMid, this.bgFront],
      x: "+=30",
      yoyo: true,
      repeat: 12,
      duration: 40,
    });

    // Fade out text
    this.tweens.add({
      targets: [this.title, ...this.storyTexts],
      alpha: 0,
      duration: 400,
    });

    // Fade to black
    this.time.delayedCall(1200, () => {
      this.cameras.main.fadeOut(800, 0, 0, 0);
    });

    // Placeholder for next scene
    this.time.delayedCall(2200, () => {
    this.scene.start("TrialScene");

      // this.scene.start("NextScene"); // later
    });
  }
}
