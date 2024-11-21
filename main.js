// การตั้งค่าพื้นฐานของเกม
const config = {
    type: Phaser.AUTO, // เลือกใช้ WebGL หรือ Canvas โดยอัตโนมัติ
    width: 720, // ความกว้างของหน้าจอเกม
    height: 1280, // ความสูงของหน้าจอเกม
    physics: {
        default: 'arcade', // ใช้ระบบฟิสิกส์ Arcade
        arcade: {
            gravity: { y: 1000 } // แรงโน้มถ่วงในแนวแกน Y
        }
    },
    scale: {
        mode: Phaser.Scale.FIT, // ปรับขนาดเกมให้พอดีกับหน้าจอ
        autoCenter: Phaser.Scale.CENTER_BOTH, // จัดกึ่งกลางเกม
        width: window.innerWidth, // ใช้ความกว้างของหน้าจอเบราว์เซอร์
        height: window.innerHeight // ใช้ความสูงของหน้าจอเบราว์เซอร์
    },
    scene: { preload, create, update } // ระบุฟังก์ชันสำหรับโหลด, สร้าง และอัปเดต
};

// สร้างเกมจากการตั้งค่า
const game = new Phaser.Game(config);

// ตัวแปรในเกม
let bird, pipes, score = 0, scoreText, pipeTimer;
let backgroundMusic; // ตัวแปรสำหรับเพลงพื้นหลัง
let gameStarted = false; // ตัวแปรสถานะเกมเริ่มหรือยัง
let isGameOver = false; // ตัวแปรสถานะเกมจบ

// ฟังก์ชันโหลดทรัพยากร (Assets)
function preload() {
    this.load.image('background', 'assets/images/background.png'); // โหลดพื้นหลัง
    this.load.image('bird', 'assets/images/bird.png'); // โหลดตัวละครนก
    this.load.image('pipe', 'assets/images/pipe.png'); // โหลดท่อ
    this.load.audio('jump', 'assets/audio/jump.mp3'); // โหลดเสียงกระโดด
    this.load.audio('gameOver', 'assets/audio/gameOver.mp3'); // โหลดเสียงจบเกม
    this.load.audio('backgroundMusic', 'assets/audio/backgroundMusic.mp3'); // โหลดเพลงพื้นหลัง
}

// ฟังก์ชันสร้างฉากเริ่มต้น
function create() {
    // เพิ่มพื้นหลัง
    const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    bg.setDisplaySize(this.scale.width, this.scale.height); // ปรับขนาดพื้นหลังให้เต็มหน้าจอ

    // สร้างตัวละครนก
    bird = this.physics.add.sprite(100, this.scale.height / 2, 'bird').setCollideWorldBounds(true);
    bird.setScale(this.scale.width * 0.14 / bird.width); // ปรับขนาดตัวละครนก
    bird.body.allowGravity = false; // ปิดแรงโน้มถ่วงในตอนเริ่มเกม

    // รีเซ็ตสถานะเกม
    gameStarted = false;
    isGameOver = false;

    // สร้างกลุ่มท่อ
    pipes = this.physics.add.group();

    // เพิ่มข้อความแสดงคะแนน
    scoreText = this.add.text(16, 16, 'Score: 0', { 
        fontSize: '16px', 
        fill: '#fff',          // สีตัวอักษร
        fontFamily: '"Press Start 2P"',   // (ถ้าต้องการ) กำหนดฟอนต์
        padding: { x: 10, y: 5 } // เพิ่ม Padding รอบข้อความ
    })
    .setStroke('#000', 4)       // เพิ่มเส้นขอบสีดำ ความหนา 4px
    .setShadow(2, 2, '#000', 2, true, true); // เพิ่มเงา
    
    // สร้างและเล่นเพลงพื้นหลัง
    backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
    backgroundMusic.play();

    // ตรวจจับการชนระหว่างนกกับท่อ
    this.physics.add.collider(bird, pipes, () => {
        this.gameOver(); // เรียกฟังก์ชันจบเกมเมื่อชนท่อ
    }, null, this);

    // เริ่มเกมเมื่อสัมผัสหน้าจอ
    this.input.on('pointerdown', () => {
        if (!gameStarted) {
            gameStarted = true; // ตั้งสถานะว่าเกมเริ่ม
            bird.body.allowGravity = true; // เปิดแรงโน้มถ่วง
            bird.setVelocityY(-400); // กระโดดครั้งแรก
            pipeTimer = this.time.addEvent({
                delay: 1200, // สร้างท่อทุก 1200 ms
                callback: addPipe,
                callbackScope: this,
                loop: true
            });
        } else {
            bird.setVelocityY(-400); // กระโดดระหว่างเล่น
            this.sound.play('jump'); // เล่นเสียงกระโดด
        }
    });

    // ฟังก์ชันจบเกม
    // เพิ่มตัวเลือก URL สำหรับเซิร์ฟเวอร์
const serverUrl = "https://your-server.com/submit-score"; // แทนที่ด้วย URL เซิร์ฟเวอร์ของคุณ

// ฟังก์ชันจบเกม (แก้ไขเพิ่มเติม)
    this.gameOver = function () {
        if (isGameOver) return;
        isGameOver = true;

        this.physics.pause();
        pipeTimer?.remove();
        bird.setTint(0xff0000);
        this.sound.play('gameOver');
        backgroundMusic.stop();

        console.log("Game Over. Score:", score);

        // วาดพื้นหลัง Gradient สำหรับข้อความ
        const bgGraphics = this.add.graphics();
        const rectWidth = 300; // ความกว้างของพื้นหลัง
        const rectHeight = 150; // ความสูงของพื้นหลัง
        const rectX = this.scale.width / 2 - rectWidth / 2; // ตำแหน่ง X
        const rectY = this.scale.height / 3 - rectHeight / 3 - 50; // ตำแหน่ง Y

        // วาด Gradient
        bgGraphics.fillStyle(0x1a1a2e); // ใช้สีพื้นหลัง (น้ำเงินเข้ม)
        bgGraphics.fillRoundedRect(rectX, rectY, rectWidth, rectHeight, 15);

        // เพิ่มข้อความ Game Over และคะแนน
        this.add.text(
            this.scale.width / 2,
            this.scale.height / 3 - 20,
            `Game Over\n\nScore: ${score}`,
            {
                fontSize: '28px',
                fill: '#fff',
                align: 'center',
                fontFamily: '"Press Start 2P"'
            }
        ).setOrigin(0.5);

        // เพิ่มปุ่ม Play Again
        const restartButton = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2.5 + 40,
            'Play Again',
            {
                fontSize: '24px',
                fill: '#ff0000',
                fontFamily: '"Press Start 2P"',
                padding: { x: 20, y: 10 },
                backgroundColor: '#222',
                stroke: '#ff6666',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.restart();
            score = 0;
            gameStarted = false;
            isGameOver = false;
            console.log("Game restarted");
        });

        // เพิ่มปุ่ม "Your SOL Address for Airdrop"
        const solButton = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2.5 + 250,
            'Add Your\n\nSOL Wallet\n\nfor Airdrop\n\n(Coming soon)',
            {
                fontSize: '16px',
                fill: '#00ff00',
                align: 'center',
                fontFamily: '"Press Start 2P"',
                padding: { x: 20, y: 10 },
                backgroundColor: '#222',
                stroke: '#00ff66',
                strokeThickness: 1
            }
        ).setOrigin(0.5).setInteractive();

        solButton.on('pointerdown', () => {
            openInputDialog(score);
        });
    };

    // ฟังก์ชันแสดงกล่องข้อความให้ผู้เล่นกรอก SOL Address
    //function openInputDialog(score) {
    //    const address = prompt("Please enter your SOL address:");
    //    if (address) {
    //        console.log("SOL Address entered:", address);
    //        sendScoreToServer(address, score);
    //    } else {
    //        console.log("SOL Address input was cancelled.");
    //    }
    //}

    // ฟังก์ชันส่งข้อมูลคะแนนและ SOL Address ไปยังเซิร์ฟเวอร์
    async function sendScoreToServer(solAddress, score) {
        const data = {
            solAddress: solAddress,
            score: score
        };

        try {
            const response = await fetch(serverUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Score submitted successfully:", result);
                alert("Your score and SOL address have been submitted!");
            } else {
                console.error("Failed to submit score:", response.statusText);
                alert("Failed to submit score. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting score:", error);
            alert("An error occurred while submitting your score. Please try again.");
        }
    }
}

// ฟังก์ชันอัปเดต (ทำงานทุกเฟรม)
function update() {
    if (isGameOver) return; // ถ้าเกมจบแล้ว ไม่ทำงานต่อ

    const groundY = this.scale.height; // ตำแหน่งพื้นอยู่ที่ขอบล่าง

    // ตรวจจับการตกถึงพื้น
    if (bird.y + bird.displayHeight / 2 >= groundY) {
        this.gameOver();
    }

    // ตรวจจับถ้าบินออกนอกจอด้านบน
    if (bird.y - bird.displayHeight / 2 <= 0) {
        this.gameOver();
    }

    // อัปเดตการทำงานของท่อ
    pipes.getChildren().forEach(pipe => {
        if (pipe && pipe.update) {
            pipe.update();
        }
    });
}

// ฟังก์ชันสร้างท่อ
function addPipe() {
    const gap = this.scale.height * 0.25; // ช่องว่างระหว่างท่อ
    const minPipeY = this.scale.height * 0.2; // ความสูงต่ำสุดของท่อบน
    const maxPipeY = this.scale.height - gap - this.scale.height * 0.2; // ความสูงสูงสุดของท่อบน

    const pipeY = Phaser.Math.Between(minPipeY, maxPipeY);

    const topPipe = pipes.create(this.scale.width, pipeY, 'pipe').setOrigin(0.5, 1).setVelocityX(-200);
    const bottomPipe = pipes.create(this.scale.width, pipeY + gap, 'pipe').setOrigin(0.5, 0).setVelocityX(-200);

    topPipe.setScale(this.scale.width * 0.18 / topPipe.width);
    bottomPipe.setScale(this.scale.width * 0.18 / bottomPipe.width);

    topPipe.body.allowGravity = false;
    bottomPipe.body.allowGravity = false;
    topPipe.body.immovable = true;
    bottomPipe.body.immovable = true;

    topPipe.scored = false;

    topPipe.update = () => {
        if (!topPipe.scored && topPipe.x < bird.x) {
            score++;
            scoreText.setText('Score: ' + score);
            topPipe.scored = true;
        }
    };
}
