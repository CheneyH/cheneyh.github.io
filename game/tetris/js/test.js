var store = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
];


function shuffle(arr) {
    var index = Math.floor(Math.random() * arr.length);
    return clone(arr[index]);
}

function clone(arr, _i = 0, _j = 0) {
    var tempArr = new Array(arr.length);
    for (var i = 0; i < arr.length; i++) {
        tempArr[i] = new Array(arr[0].length);
        for (var j = 0; j < arr[0].length; j++) {
            tempArr[i + _i][j + _j] = arr[i][j];
        }
    }
    return tempArr;
}

var arr = [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
];


var temp = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
];
for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[0].length; j++) {
        temp[j][i] = arr[i][j];
    }
}

console.log(temp);