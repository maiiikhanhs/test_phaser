import Phaser from "phaser";

//START SCENE
class StartScene extends Phaser.Scene {
  private bgMusic!: Phaser.Sound.BaseSound;

  constructor() {
    super("StartScene");
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.audio("startMusic", "assets/start.music.mp3");
  }

  create() {
    this.add.image(400, 250, "sky").setDisplaySize(800, 500);

    this.add
      .text(400, 200, "Falling Stars Game", { fontSize: "40px", color: "#ffffff" })
      .setOrigin(0.5);

    this.add
      .text(400, 270, "Press SPACE to Start", { fontSize: "24px", color: "#ffff00" })
      .setOrigin(0.5);

    this.bgMusic = this.sound.add("startMusic", { loop: true, volume: 0.5 });
    this.bgMusic.play();

    // Non-null assertion để TS không cảnh báo
    this.input.keyboard!.once("keydown-SPACE", () => {
      this.bgMusic.stop();
      this.scene.start("FallingStarsGame");
    });
  }
}

//GAME SCENE
class FallingStarsGame extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private stars!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private score = 0;
  private lives = 5;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;

  constructor() {
    super("FallingStarsGame");
  }

  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("star", "assets/star.png");
    this.load.image("sky", "assets/sky.png");
    this.load.audio("catch", "assets/catch.mp3");
    this.load.audio("miss", "assets/miss.mp3");
  }

  create() {
    //Reset moi game moi
    this.score = 0;
    this.lives = 5;

    this.add.image(400, 250, "sky").setDisplaySize(800, 500);

    this.player = this.physics.add.sprite(400, 450, "player");
    this.player.setCollideWorldBounds(true);

    // Khai bao classType de .create tra ve Arcade.Sprite 
    this.stars = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      runChildUpdate: false,
    });

    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "24px",
      color: "#ffffff",
    });
    this.livesText = this.add.text(16, 50, "Lives: 5", {
      fontSize: "24px",
      color: "#ff0000",
    });

    this.cursors = this.input.keyboard!.createCursorKeys();

    // Callback ky hieu ArcadePhysicsCallback đung chuan 
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.catchStar as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    this.time.addEvent({
      delay: 2000,
      callback: this.spawnStar,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (this.cursors.left?.isDown) this.player.setVelocityX(-200);
    else if (this.cursors.right?.isDown) this.player.setVelocityX(200);
    else this.player.setVelocityX(0);

    //Dung children.each va truyen context 
    this.stars.children.each(
      (child: Phaser.GameObjects.GameObject) => {
        const star = child as Phaser.Physics.Arcade.Sprite;
        if (star.active && star.y > 500) {
          // Khong nhat duoc sao → tru 1 mang, KHONG tru điem
          this.sound.play("miss");
          star.disableBody(true, true);

          this.lives -= 1;
          this.livesText.setText("Lives: " + this.lives);

          if (this.lives <= 0) {
            this.scene.start("GameOverScene", { score: this.score });
          }
        }
        return true;
      },
      this // <= context cho TS
    );
  }

  // Ky kieu theo ArcadePhysicsCallback đe khong bao loi TS
  private catchStar = (
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    starObj: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) => {
    const star = starObj as Phaser.Physics.Arcade.Sprite;
    star.disableBody(true, true);

    this.sound.play("catch");
    this.score += 1;
    this.scoreText.setText("Score: " + this.score);
  };

  private spawnStar = () => {
    const star = this.stars.create(
      Phaser.Math.Between(50, 750),
      0,
      "star"
    ) as Phaser.Physics.Arcade.Sprite;

    star.setVelocityY(Phaser.Math.Between(100, 150));
  };
}

// GAME OVER SCENE
class GameOverScene extends Phaser.Scene {
  private finalScore = 0;

  constructor() {
    super("GameOverScene");
  }

  init(data: { score?: number }) {
    this.finalScore = data?.score ?? 0;
  }

  create() {
    this.add.image(400, 250, "sky").setDisplaySize(800, 500);

    this.add.text(400, 200, "Game Over", {
      fontSize: "48px",
      color: "#ff0000",
    }).setOrigin(0.5);

    this.add.text(400, 270, `Final Score: ${this.finalScore}`, {
      fontSize: "28px",
      color: "#ffffff",
    }).setOrigin(0.5);

    this.add.text(400, 350, "Press SPACE to Restart", {
      fontSize: "24px",
      color: "#00ff00",
    }).setOrigin(0.5);

    this.input.keyboard!.once("keydown-SPACE", () => {
      this.scene.start("StartScene");
    });
  }
}

// CONFIG
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  backgroundColor: "#87CEEB",
  physics: {
    default: "arcade",
    arcade: {
      gravity: {x: 0, y: 0 },
      debug: false,
    },
  },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [StartScene, FallingStarsGame, GameOverScene],
};

new Phaser.Game(config);
