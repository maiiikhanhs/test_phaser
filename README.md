# 🌟 Falling Stars Game

Một mini game đơn giản bằng Phaser 3 + TypeScript + Vite.  
Người chơi điều khiển nhân vật để hứng các ngôi sao rơi từ bầu trời.  

- Hứng được sao → **+1 điểm**  
- Bỏ lỡ sao → **-1 mạng**  
- Hết mạng → **Game Over**  


1. 🚀 Template & Công nghệ
- **Vite** → build & dev server  
- **TypeScript** → viết code có kiểu  
- **Phaser 3** → framework game 2D  

2. 🎮 Thành phần chính

### 🎬 Scene
Tách logic game thành nhiều màn:  
- **StartScene** → menu, nhạc nền  
- **FallingStarsGame** → chơi chính  
- **GameOverScene** → điểm số, restart  

Ví dụ:  
class StartScene extends Phaser.Scene {  
&nbsp;&nbsp;create() {  
&nbsp;&nbsp;&nbsp;&nbsp;this.add.text(400, 250, "Falling Stars", { fontSize: "40px" }).setOrigin(0.5);  
&nbsp;&nbsp;}  
}  


### 🗂️ Container
- Gom nhiều đối tượng (background, title, instruction) thành 1 nhóm  
- Dễ dàng căn chỉnh theo tọa độ  
- Có thể gắn sự kiện chuột / touch  

Ví dụ:  
this.container = this.add.container(400, 250, [bg, title, instruction]);  
this.container.setInteractive().on("pointerdown", this.startGame, this);  

### 🖼️ Image
- Hiển thị hình ảnh nền, nhân vật, ngôi sao  
- Kết hợp với physics để tạo chuyển động  

Ví dụ:  
this.add.image(400, 250, "sky");  
this.player = this.physics.add.sprite(400, 450, "player");  


### 🎵 Audio
- Nhạc nền cho menu hoặc trong game  
- Âm thanh hiệu ứng khi bắt / trượt sao  

Ví dụ:  
this.sound.add("startMusic", { loop: true }).play();  
this.sound.play("catch");  


### 📝 Text
- Hiển thị tiêu đề game  
- Hiển thị điểm số, mạng sống, thông báo Game Over  

Ví dụ:  
this.add.text(400, 200, "Game Over", { fontSize: "48px" }).setOrigin(0.5);  
this.scoreText = this.add.text(16, 16, "Score: 0");  


3. 🏗️ Cấu trúc thư mục
falling-stars-game/  
├── public/assets/       
├── src/main.ts       
├── index.html           
├── package.json        
└── README.md            


4. ⚙️ Cài đặt & chạy git clone https://github.com/maiiikhanhs/test_phaser
cd falling-stars-game  
npm install  
npm run dev  

Truy cập: http://localhost:5173  


