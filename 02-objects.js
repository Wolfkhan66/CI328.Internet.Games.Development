var game;

class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    get area() {
        return this.calcArea();
    }

    calcArea() {
        return this.height * this.width;
    }
}

const rect = new Rectangle(800, 600);

console.log(rect.area);

function main() {
    game = new Phaser.Game(800, 600, Phaser.AUTO, '', { create: create });
}

function create() {
    var textObject = new TextObject("Phaser is working with objects!");
    textObject.x = 100;
    textObject.y = 100;
    textObject.fill = "#FAD"
    textObject.fontSize = "18px";
    textObject.commit();
}

// prototype
function TextObject(message) {

    // properties
    this.x = 0;
    this.y = 0;
    this.message = message;
    this.fontSize = "32px";
    this.fill = "#FFF";

    // store phaser text object and wrap it with ours
    this._text = game.add.text(this.x, this.y, message, { fontSize: this.fontSize, fill: this.fill });

    // function
    this.commit = function() {
        this._text.x = this.x;
        this._text.y = this.y;
        this._text.text = this.message;
        this._text.fontSize = this.fontSize;
        this._text.fill = this.fill;
    };
}