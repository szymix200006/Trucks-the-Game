const board = document.querySelector('.board');
const restartButton = document.querySelector('.restart');
const score = document.querySelector('.score');
const highScore = document.querySelector('.highScore');
var endScreen = document.querySelector('.endScreen');
var collectedPackages = document.querySelector('.collectedPackages');
var amount = 0;

let playerInt;
let enemyInt;

function Vehicle(physicalForm, color, road, size, speed) {
    this.physicalForm = physicalForm;
    this.posX = 600;
    this.posY = 200;
    this.color = color;
    this.road = road;
    this.size = size;
    this.speed = speed;
}


Vehicle.prototype.assignVeh = function() {
    this.physicalForm.style.marginTop = this.posX + "px";
        this.physicalForm.style.marginLeft = this.posY + "px";
        this.physicalForm.style.backgroundColor = this.color;
        this.physicalForm.style.width = this.size + "px";
        this.physicalForm.style.height = this.size + "px";
        this.physicalForm.style.position = "absolute";
        this.road.physicalForm.append(this.physicalForm);
};

function Road(width, physicalForm, color){
    this.width = width;
    this.physicalForm = physicalForm;
    this.color = color;
    this.generateRoad = () => {
        this.physicalForm.style.width = this.width + "px";
        this.physicalForm.style.backgroundColor = this.color;
        this.physicalForm.style.height = "100vh";
        this.physicalForm.style.marginLeft = "50%";
        this.physicalForm.style.transform = "translateX(-50%)";
        this.physicalForm.style.zIndex = "-9999999";
        board.append(this.physicalForm);
    };
}

function UserVehicle(physicalForm, color, road, size, speed) {
    Vehicle.call(this, physicalForm, color, road, size, speed);

    this.move = function(direction){
        switch (direction){
            case "ArrowUp": this.posX -= 10;
            break;
            case "ArrowDown": this.posX += 10;
            break;
            case "ArrowLeft": this.posY -= 10;
            break;
            case "ArrowRight": this.posY += 10;
            break;
        }
        this.physicalForm.style.marginTop = this.posX + "px";
        this.physicalForm.style.marginLeft = this.posY + "px";
        if(this.posY <= 0 || this.posX <= 0 || this.posY >= this.road.width-this.size ){
            onFail();
        }
    };
}

UserVehicle.prototype = new Vehicle();
UserVehicle.prototype.constructor = UserVehicle;

function EnemyVehicle(physicalForm, color, road, size) {
    Vehicle.call(this, physicalForm, color, road,size);
}

EnemyVehicle.prototype = new Vehicle();
EnemyVehicle.prototype.constructor = UserVehicle;
EnemyVehicle.prototype.generate = function(player,road) {
    const enemy = document.createElement('div');
    const newCar = new EnemyVehicle(enemy, "blue", road, 100);
    newCar.posY = Math.round(Math.random()*(road.width-newCar.size));
    newCar.posX = 0;
    setInterval(()=>{
        if(player.posX + player.size >= newCar.posX &&
            player.posX <= newCar.posX + newCar.size &&
            player.posY + player.size >= newCar.posY &&
            player.posY <= newCar.posY + newCar.size) {
                onFail();
         }
    },1000/60)
    newCar.assignVeh();
    let intId = setInterval(() => {
        newCar.posX += 1;
        newCar.physicalForm.style.marginTop = newCar.posX + "px";
        if(newCar.posX > window.innerHeight){
            clearInterval(intId)
            newCar.physicalForm.remove()
            delete this
        }
    },20)
}

function Package(road,physicalForm,size) {
    this.value = 1;
    this.posY = 0;
    this.posX = 0;
    this.color = "brown";
    this.size = size;
    this.physicalForm = physicalForm;
    this.road = road;
}

Package.prototype.assignPack = function() {
    this.physicalForm.style.marginLeft = this.posY + "px";
    this.physicalForm.style.marginTop = this.posX + "px";
    this.physicalForm.style.backgroundColor = this.color;
    this.physicalForm.style.width = this.size + "px";
    this.physicalForm.style.height = this.size + "px";
    this.physicalForm.style.position = "absolute";
    this.road.append(this.physicalForm);
}

Package.prototype.generatePack = function(player,road){
    const pack = document.createElement('div');
    const newPackage = new Package(road.physicalForm,pack,50);
    newPackage.posY = Math.round(Math.random()*(road.width-newPackage.size));
    newPackage.posX = Math.round(Math.random()*(window.innerHeight-newPackage.size));
    let intId = setInterval(()=>{
        if(player.posX + player.size >= newPackage.posX &&
            player.posX <= newPackage.posX + newPackage.size &&
            player.posY + player.size >= newPackage.posY &&
            player.posY <= newPackage.posY + newPackage.size) {
                collectedPackages.innerHTML = ++amount;
                pack.remove()
                clearInterval(intId)
         }
    },1000/60)
    newPackage.assignPack();
}

let player1obj = document.createElement('div');
let road1obj;
let road1;
let player1;
let enemy;
let pack;

function onAppStart() {
    road1obj = document.createElement('div');
    road1 = new Road(500, road1obj, 'grey');
    player1 = new UserVehicle(player1obj, "red", road1, 100);
    enemy = new EnemyVehicle();
    pack = new Package();

    road1.generateRoad();
    player1.assignVeh();

    enemyInt = setInterval(()=>{
        enemy.generate(player1,road1)
    },5000)

    playerInt = setInterval(()=>{
        pack.generatePack(player1,road1)
    },4000)

    document.addEventListener("keydown", (e) => {
        var code = e.key;
        player1.move(code);
    });
}

function onFail() {
    restartButton.addEventListener('click', ()=>{
        location.reload()
    });
    road1obj.remove();
    clearInterval(enemyInt);
    clearInterval(playerInt)
    endScreen.style.display = "block";
    endScreen.style.marginTop = -window.innerHeight + "px";
    if(localStorage.getItem('highScore')){
        if(amount < localStorage.getItem('highScore')) {
            console.log(amount, localStorage.getItem('highScore'))
            score.innerHTML = "Score: " + amount;
            highScore.innerHTML = "High Score: " + localStorage.getItem('highScore');
        } else {
            console.log(amount, localStorage.getItem('highScore'), "wieej")
            localStorage.setItem('highScore', amount);
            score.innerHTML = "New Record " + amount;
            highScore.innerHTML = "High Score: " + localStorage.getItem('highScore');
        }
    }else{
        localStorage.setItem('highScore',amount);
        score.innerHTML = "New Record" + amount;
        highScore.innerHTML = "High Score: " + localStorage.getItem('highScore');
    }
}

window.onload = onAppStart;


