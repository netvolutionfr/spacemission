
var game = new Phaser.Game(800, 550, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.tilemap('level1', 'assets/tilemaps/maps/cybernoid.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('cybernoid', 'assets/tilemaps/tiles/cybernoid.png');
    game.load.image('objets', 'assets/tilemaps/tiles/objets.png');

    game.load.image('phaser', 'assets/sprites/phaser-ship.png');
    game.load.image('chunk', 'assets/sprites/chunk.png');

}

var map;
var layer;
var items;
var cursors;
var sprite;
var emitter;
var score = 0;
var scoreText;
var objets;
var arrayObjets = new Array();
var i=0;

function create() {

    // Charger la carte du jeu
    map = game.add.tilemap('level1');

    // Insérer les images dans la carte
    map.addTilesetImage('cybernoid');
    map.addTilesetImage('objets');

    // Créer les couches d'objets de la carte
    layer = map.createLayer('level1');
    objets = map.createLayer('objets');

    // Gérer les collisions avec le décor
    map.setCollisionByExclusion([7, 32, 35, 36, 47, 71, 72],'true','level1');

    // Gérer les collisions avec les objets
    // map.setCollisionBetween(0,250,'true','items');
    for (i=0;i<225;i++) {
        arrayObjets[i] = i+89;
    }
    map.setTileIndexCallback(arrayObjets, toucheObjet, this, 'objets');

    // layer.debug = true;

    layer.resizeWorld();

    cursors = game.input.keyboard.createCursorKeys();

    emitter = game.add.emitter(0, 0, 200);

    emitter.makeParticles('chunk');
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.gravity = 150;
    emitter.bounce.setTo(0.5, 0.5);

    sprite = game.add.sprite(200, 70, 'phaser');
    sprite.anchor.setTo(0.5, 0.5);

    scoreText2 = game.add.text(17, 17, 'score: 0', { font: '14px arial', fill: '#000' });
    scoreText2.fixedToCamera = true;
    scoreText = game.add.text(16, 16, 'score: 0', { font: '14px arial', fill: '#fff' });
    scoreText.fixedToCamera = true;
    game.camera.follow(sprite);

}

function particleBurst() {

    emitter.x = sprite.x;
    emitter.y = sprite.y;
    emitter.start(true, 2000, null, 1);

}

function update() {

    game.physics.collide(sprite, layer);
    game.physics.collide(emitter, layer);
//    game.physics.overlap(sprite, objets, collectObject, null, this);
    game.physics.collide(sprite, objets);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -150;
        particleBurst();
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 150;
        particleBurst();
    }

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -150;
        sprite.scale.x = -1;
        particleBurst();
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 150;
        sprite.scale.x = 1;
        particleBurst();
    }

}

function toucheObjet(sprite,objet) {
    if (objet.tile.index == 106) {
        score +=10;
    } else {
        score++;
    }
    objet.tile.copy(0);
    objets.dirty = true;

    scoreText.setText("Score : " + score);
    scoreText2.setText("Score : " + score);
}
