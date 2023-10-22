const consoleScreen :HTMLElement | null = document.getElementById("console");

let playerX : number = 1
let playerY : number = 1
let playerZ : number = 0

let rotationSpeed : number = 0.01
let playerSpeed : number = 0.1

let FOV : number = Math.PI / 4
let stepRay : number = 0.1
let depth = 16

let width : number = 120;
let height : number = 40;

let mapHeight : number = 16, mapWidth : number = 16;

let START : boolean = true

const getBlock = (map : string, x : number, y : number) => {
    if(x >= 0 && x < mapWidth && y >= 0 && y <= mapHeight)
        return map[y * mapWidth + x]
    else
        return '#' //ray exit - return block
}

const Display = (screenConsole : Array<string>) =>{
    //console.log(screen.join(''))
    if (consoleScreen){
        let displayOutput : string = ''
        for(let i = 0; i < width * height; i++){
            if(i % width == 0) displayOutput += '\n'
            displayOutput += screenConsole[i];
        }
        consoleScreen.textContent = displayOutput;
    }
}

const DisplayMap = () =>{
    if (consoleScreen){
        let displayOutput : string = ''
        displayOutput += 'PRESS "Space" to change map'
        displayOutput += '<br><br>'
        for(let i = 0; i < mapWidth * mapHeight; i++){
            if(i % mapWidth == 0){
                displayOutput += '<br>'
            }
            if(map[i] == '#') displayOutput += map[i];
            else displayOutput += '\u00A0'
        }
        displayOutput += '<br><br>'
        displayOutput += 'PRESS "Enter" to start game'
        consoleScreen.innerHTML = displayOutput;
    }
}

let map : string = '################'
       map += '#              #'
       map += '#              #'
       map += '#              #'
       map += '#              #'
       map += '#              #'
       map += '#              #'
       map += '#              #'
       map += '#              #'
       map += '#              #'
       map += '#              #'
       map += '#              #'
       map += '#              #'
       map += '#              #'
       map += '#              #'
       map += '################';

let screenConsole : Array<string> = [""];

document.addEventListener("keydown", function(event){
    ENGINE(event);
});

//------> ENGINE <--------//
const ENGINE = (event)=>{
    if(!START){
    if(event.code == "KeyA"){
        playerZ -= (playerSpeed * 0.75) 
    }
    if(event.code == "KeyD"){
        playerZ += (playerSpeed * 0.75) 
    }
    if(event.code == "KeyW"){
        playerX += Math.sin(playerZ) * playerSpeed
        playerY += Math.cos(playerZ) * playerSpeed

        if(map[Math.round(playerY) * mapWidth + Math.round(playerX)] == '#'){
            playerX -= Math.sin(playerZ) * playerSpeed
            playerY -= Math.cos(playerZ) * playerSpeed
        }
    }
    if(event.code == "KeyS"){
        playerX -= Math.sin(playerZ) * playerSpeed
        playerY -= Math.cos(playerZ) * playerSpeed
        
        if(map[Math.round(playerY) * mapWidth + Math.round(playerX)] == '#'){
            playerX += Math.sin(playerZ) * playerSpeed
            playerY += Math.cos(playerZ) * playerSpeed
        }
    }

    drawDisplay()
    }
    else{
        if(event.code == "Space"){
            setNullMap()
            createMapRandomPoint()
            DisplayMap()
        }
        if(event.code == "Enter"){
            START = false
            drawDisplay()
        }
    }
}

const drawDisplay = () => {
    for(let x = 0; x < width; x++){
            let rayCast : number = 
                (playerZ - FOV / 2) + (x / width) * FOV;
            
            let eyeX : number = Math.sin(rayCast);
            let eyeY : number = Math.cos(rayCast);
            let distance : number = 0;

            while(distance < depth){
                distance += stepRay
                let pointX : number = Math.round(playerX + eyeX * distance)
                let pointY : number = Math.round(playerY + eyeY * distance)

                if (getBlock(map, pointX, pointY) == '#'){
                    break
                }
            }

            let ceiling : number = Math.round(height / 2 - height / distance)
            let floor : number = Math.round(height - ceiling)

            let shade = ' '

            for (let y = 0; y < height; y++){
                if(y <= ceiling)
                    shade = '`';
                else if (y > ceiling && y <= floor){
                    if (distance <= depth / 4)
                        shade = '█'
                    else if (distance <= depth / 3)
                        shade = '▓'
                    else if (distance <= depth / 2)
                        shade = '▒'
                    else if (distance <= depth)
                        shade = '░'
                    else
                        shade = '\u00A0'
                }
                else{
                    let bottom = 1 - (y - height / 2) / (height / 2)
                    if (bottom < 0.25)
                        shade = '#'
                    else if (bottom < 0.5)
                        shade = 'x'
                    else if (bottom < 0.75)
                        shade = '.'
                    else
                        shade = '\u00A0'
                }

                screenConsole[y * width + x] = shade;
            }
        }
    screenConsole[width * height - 1] = '\0'
    screenConsole[1] = 'X';
    screenConsole[2] = ':';
    screenConsole[3] = Math.round(playerX).toString();
    screenConsole[5] = 'Y';
    screenConsole[6] = ':';
    screenConsole[7] = Math.round(playerY).toString();
    Display(screenConsole);
}

const createMapRandomPoint = () =>{
    //MEANING of Generation//
	//1. Take a point on the coordinates (by RANDOM)
	//2. Determine what size the object will be at this point (by RANDOM)
	//3. Create this object considering the size of the display

	let count_of_max_objects : number = 10;
	let count_of_max_size_object : number = 20;
	let count_of_spawnObject : number = Random(0, count_of_max_objects);
	let count_of_size_object : number = 0;

	let map_x : number = 0;
	let map_y : number = 0;
    let _map : Array<string> = map.split('');

	let vector_go_x : number = 0;
	let vector_go_y : number = 0;

	//while spawn object not end
	while (count_of_spawnObject >= 0) {
		map_x = Random(1, mapWidth - 1)
		map_y = Random(1, mapHeight - 1)
		_map[map_y * mapWidth + map_x] = '#';

		count_of_size_object = Random(1, count_of_max_size_object);
		for (let i = 0; i < count_of_size_object; i++) {
			vector_go_x = Random(-1, 2);
			while ((map_x + vector_go_x <= 0) || (map_x + vector_go_x) >= mapWidth) vector_go_x = Random(-1, 2);
			vector_go_y = Random(-1, 2);
			while ((map_y + vector_go_y <= 0) || (map_y + vector_go_y) >= height) vector_go_y = Random(-1, 2);

			map_x += vector_go_x;
			map_y += vector_go_y;
			_map[map_y * mapWidth + map_x] = '#';
		}

		count_of_spawnObject--;
	}

    map = _map.join('')
}

const Random = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

const setNullMap = () =>{
    let _map : Array<string> = ['']
    for(let x = 0; x < mapWidth; x++)
        for(let y = 0; y < mapHeight; y++)
            if(x == 0 || x == mapWidth - 1)
                _map[y * mapWidth + x] = '#'
            else if (y == 0 || y == mapHeight - 1)
                  _map[y * mapWidth + x] = '#'
            else
                _map[y * mapWidth + x] = '\u00A0'
    
    map = _map.join('')
}

DisplayMap()