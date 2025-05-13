let config = {
    renderer: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
let game = new Phaser.Game(config); 
function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('road', 'assets/road.png');
    this.load.image('column', 'assets/column.png');
    this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96 });
}
let bird; 
let landed = false; 
let cursor; 
let bump = false; 
let messageToPlayer;


  
function create() {
    // Add background image
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);

    // Create static group for the road (using physics)
    const roads = this.physics.add.staticGroup();
    const road = roads.create(400, 568, 'road').setScale(2).refreshBody();

    // Create top columns
    const topColumns = this.physics.add.staticGroup({
        key: 'column',
        repeat: 1,
        setXY: { x: 200, y: 0, stepX: 300 }
    });

    // Create bottom columns
    const bottomColumns = this.physics.add.staticGroup({
        key: 'column',
        repeat: 1,
        setXY: { x: 350, y: 400, stepX: 300 }
    });
    bird = this.physics.add.sprite(0, 50, 'bird').setScale(2);
    bird.setBounce(0.2);
    bird.setCollideWorldBounds(true);
    
    this.physics.add.overlap(bird, road, () => landed = true, null, this); 
    this.physics.add.collider(bird, road);
    this.physics.add.overlap(bird, topColumns, () => bump = true, null, this); 
    this.physics.add.collider(bird, topColumns);
    this.physics.add.overlap(bird, bottomColumns, () => bump = true, null, this);

    this.physics.add.collider(bird, bottomColumns);
     
    cursor = this.input.keyboard.createCursorKeys();
    messageToPlayer = this.add.text(0, 0, `Instructions: Press space bar to start`, { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "20px", color: "white", backgroundColor: "black" });
    Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 0, 50);


}
let getStarted = false; 
let hori = false ;


function update(){
    if(cursor.space.isDown && !getStarted ){
        getStarted = true; 
        messageToPlayer.text = 'Instructions: Press the "^" button to stay upright\nAnd don\'t hit the columns or ground';
        
        
    }
    if(!getStarted){
        bird.setVelocityY(-160);
    }
    
    
    bird.body.velocity.x = 50;
    if(cursor.up.isDown && !landed){
        bird.setVelocityY(-160); 
        
    }
    
    if (!landed || !bump) {
        bird.body.velocity.x = 50;
    }
      
    if (landed || bump || !getStarted) {
        bird.body.velocity.x = 0;
    }
    if (landed || bump) {
        messageToPlayer.text = `Oh no! You crashed!`;
    }
    function update() {
        if (bird.x > 0.1) {
          bird.setVelocityY(40);
          messageToPlayer.text = `Congrats! You won!`;
        } 
      
    }

    

}