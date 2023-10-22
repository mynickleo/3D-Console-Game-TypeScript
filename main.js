var consoleScreen = document.getElementById("console");
var playerX = 1;
var playerY = 1;
var playerZ = 0;
var rotationSpeed = 0.01;
var playerSpeed = 0.1;
var FOV = Math.PI / 4;
var stepRay = 0.1;
var depth = 16;
var width = 120;
var height = 40;
var mapHeight = 16, mapWidth = 16;
var START = true;
var getBlock = function (map, x, y) {
    if (x >= 0 && x < mapWidth && y >= 0 && y <= mapHeight)
        return map[y * mapWidth + x];
    else
        return '#'; //ray exit - return block
};
var Display = function (screenConsole) {
    //console.log(screen.join(''))
    if (consoleScreen) {
        var displayOutput = '';
        for (var i = 0; i < width * height; i++) {
            if (i % width == 0)
                displayOutput += '\n';
            displayOutput += screenConsole[i];
        }
        consoleScreen.textContent = displayOutput;
    }
};
var DisplayMap = function () {
    if (consoleScreen) {
        var displayOutput = '';
        displayOutput += 'PRESS "Space" to change map';
        displayOutput += '<br><br>';
        for (var i = 0; i < mapWidth * mapHeight; i++) {
            if (i % mapWidth == 0) {
                displayOutput += '<br>';
            }
            if (map[i] == '#')
                displayOutput += map[i];
            else
                displayOutput += '\u00A0';
        }
        displayOutput += '<br><br>';
        displayOutput += 'PRESS "Enter" to start game';
        consoleScreen.innerHTML = displayOutput;
    }
};
var map = '################';
map += '#              #';
map += '#              #';
map += '#              #';
map += '#              #';
map += '#              #';
map += '#              #';
map += '#              #';
map += '#              #';
map += '#              #';
map += '#              #';
map += '#              #';
map += '#              #';
map += '#              #';
map += '#              #';
map += '################';
var screenConsole = [""];
document.addEventListener("keydown", function (event) {
    ENGINE(event);
});
//------> ENGINE <--------//
var ENGINE = function (event) {
    if (!START) {
        if (event.code == "KeyA") {
            playerZ -= (playerSpeed * 0.75);
        }
        if (event.code == "KeyD") {
            playerZ += (playerSpeed * 0.75);
        }
        if (event.code == "KeyW") {
            playerX += Math.sin(playerZ) * playerSpeed;
            playerY += Math.cos(playerZ) * playerSpeed;
            if (map[Math.round(playerY) * mapWidth + Math.round(playerX)] == '#') {
                playerX -= Math.sin(playerZ) * playerSpeed;
                playerY -= Math.cos(playerZ) * playerSpeed;
            }
        }
        if (event.code == "KeyS") {
            playerX -= Math.sin(playerZ) * playerSpeed;
            playerY -= Math.cos(playerZ) * playerSpeed;
            if (map[Math.round(playerY) * mapWidth + Math.round(playerX)] == '#') {
                playerX += Math.sin(playerZ) * playerSpeed;
                playerY += Math.cos(playerZ) * playerSpeed;
            }
        }
        drawDisplay();
    }
    else {
        if (event.code == "Space") {
            setNullMap();
            createMapRandomPoint();
            DisplayMap();
        }
        if (event.code == "Enter") {
            START = false;
            drawDisplay();
        }
    }
};
var drawDisplay = function () {
    for (var x = 0; x < width; x++) {
        var rayCast = (playerZ - FOV / 2) + (x / width) * FOV;
        var eyeX = Math.sin(rayCast);
        var eyeY = Math.cos(rayCast);
        var distance = 0;
        while (distance < depth) {
            distance += stepRay;
            var pointX = Math.round(playerX + eyeX * distance);
            var pointY = Math.round(playerY + eyeY * distance);
            if (getBlock(map, pointX, pointY) == '#') {
                break;
            }
        }
        var ceiling = Math.round(height / 2 - height / distance);
        var floor = Math.round(height - ceiling);
        var shade = ' ';
        for (var y = 0; y < height; y++) {
            if (y <= ceiling)
                shade = '`';
            else if (y > ceiling && y <= floor) {
                if (distance <= depth / 4)
                    shade = '█';
                else if (distance <= depth / 3)
                    shade = '▓';
                else if (distance <= depth / 2)
                    shade = '▒';
                else if (distance <= depth)
                    shade = '░';
                else
                    shade = '\u00A0';
            }
            else {
                var bottom = 1 - (y - height / 2) / (height / 2);
                if (bottom < 0.25)
                    shade = '#';
                else if (bottom < 0.5)
                    shade = 'x';
                else if (bottom < 0.75)
                    shade = '.';
                else
                    shade = '\u00A0';
            }
            screenConsole[y * width + x] = shade;
        }
    }
    screenConsole[width * height - 1] = '\0';
    screenConsole[1] = 'X';
    screenConsole[2] = ':';
    screenConsole[3] = Math.round(playerX).toString();
    screenConsole[5] = 'Y';
    screenConsole[6] = ':';
    screenConsole[7] = Math.round(playerY).toString();
    Display(screenConsole);
};
var createMapRandomPoint = function () {
    //MEANING of Generation//
    //1. Take a point on the coordinates (by RANDOM)
    //2. Determine what size the object will be at this point (by RANDOM)
    //3. Create this object considering the size of the display
    var count_of_max_objects = 10;
    var count_of_max_size_object = 20;
    var count_of_spawnObject = Random(0, count_of_max_objects);
    var count_of_size_object = 0;
    var map_x = 0;
    var map_y = 0;
    var _map = map.split('');
    var vector_go_x = 0;
    var vector_go_y = 0;
    //while spawn object not end
    while (count_of_spawnObject >= 0) {
        map_x = Random(1, mapWidth - 1);
        map_y = Random(1, mapHeight - 1);
        _map[map_y * mapWidth + map_x] = '#';
        count_of_size_object = Random(1, count_of_max_size_object);
        for (var i = 0; i < count_of_size_object; i++) {
            vector_go_x = Random(-1, 2);
            while ((map_x + vector_go_x <= 0) || (map_x + vector_go_x) >= mapWidth)
                vector_go_x = Random(-1, 2);
            vector_go_y = Random(-1, 2);
            while ((map_y + vector_go_y <= 0) || (map_y + vector_go_y) >= height)
                vector_go_y = Random(-1, 2);
            map_x += vector_go_x;
            map_y += vector_go_y;
            _map[map_y * mapWidth + map_x] = '#';
        }
        count_of_spawnObject--;
    }
    map = _map.join('');
};
var Random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
var setNullMap = function () {
    var _map = [''];
    for (var x = 0; x < mapWidth; x++)
        for (var y = 0; y < mapHeight; y++)
            if (x == 0 || x == mapWidth - 1)
                _map[y * mapWidth + x] = '#';
            else if (y == 0 || y == mapHeight - 1)
                _map[y * mapWidth + x] = '#';
            else
                _map[y * mapWidth + x] = '\u00A0';
    map = _map.join('');
};
DisplayMap();
