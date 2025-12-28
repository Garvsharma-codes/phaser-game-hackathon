import Phaser from "phaser";

export default class EnemyDialogueScene extends Phaser.Scene {
  constructor() {
    super("EnemyDialogueScene");
  }

  preload() {
    this.load.image("enemy", "/enemy.png");
    this.load.image("enemyBG", "/enemy-world-bg.png");
  }

  create() {
    const { width, height } = this.scale;

    // ─── BACKGROUND: ENEMY WORLD ───
    this.bg = this.add.image(width / 2, height / 2, "enemyBG");
    this.bg.setDisplaySize(width, height);
    this.bg.setAlpha(0.9);

    // Dark overlay for mood
    this.overlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.55
    );

    // ─── ENEMY (DEFEATED POSTURE) ───
    this.enemy = this.add.image(width / 2, height / 2 + 120, "enemy");
    this.enemy.setScale(0.9);
    this.enemy.setAlpha(0.35);
    this.enemy.setTint(0x00ffcc);

    // Head-down illusion
    this.enemy.setAngle(-10);
    this.enemy.y += 20;

    // Subtle breathing flicker
    this.time.addEvent({
      delay: 160,
      loop: true,
      callback: () => {
        this.enemy.alpha = Phaser.Math.FloatBetween(0.28, 0.4);
      },
    });

    // ─── DIALOGUE ───
    this.lines = [
      "This defeat is temporary.",
      "You damaged only the shell.",
      "My core remains untouched.",
      "I return to evolve.",
      "When next we meet...",
      "you will not survive.",
    ];

    this.currentLine = 0;

    this.dialogueText = this.add.text(
      width / 2,
      height - 170,
      "",
      {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#00ffcc",
        align: "center",
      }
    ).setOrigin(0.5);

    this.showNextLine();

    // Auto-advance dialogue
    this.time.addEvent({
      delay: 2400,
      loop: true,
      callback: () => this.showNextLine(),
    });
  }

  showNextLine() {
    if (this.currentLine >= this.lines.length) {
      this.enemyRetreat();
      return;
    }

    const text = this.lines[this.currentLine];
    this.dialogueText.setText("");

    let i = 0;

    this.time.addEvent({
      delay: 40,
      repeat: text.length - 1,
      callback: () => {
        this.dialogueText.text += text[i];
        i++;
      },
    });

    this.currentLine++;
  }

  enemyRetreat() {
    // Enemy turns away
    this.tweens.add({
      targets: this.enemy,
      angle: 180,
      duration: 1200,
      ease: "Sine.easeInOut",
    });

    // Enemy walks into portal / ship
    this.tweens.add({
      targets: this.enemy,
      y: this.enemy.y - 300,
      alpha: 0,
      duration: 2600,
      ease: "Sine.easeInOut",
    });

    // Portal / world pulse
    this.cameras.main.flash(500, 0, 255, 200);

    // Fade everything
    this.time.delayedCall(2800, () => {
      this.cameras.main.fadeOut(1200, 0, 0, 0);
    });

    this.time.delayedCall(4200, () => {
      console.log("ENTER MAIN GAME");
      // this.scene.start("MainGameScene");
    });
  }
}
