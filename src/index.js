module.exports = function solveSudoku(matrix) {

    function findMissingNumbers(arr) {
        let arrOfMissingNumbers = [];

        for (let i = 1; i < 10; i++) {
            if (arr.indexOf(i) === -1) {
                arrOfMissingNumbers.push(i);
            }
        }
        return arrOfMissingNumbers;
    }

    function arrFromVertical(matrix, index) {
        let arrVertical = [];

        for (let i = 0; i < matrix.length; i++) {
            arrVertical.push(matrix[i][index]);
        }
        return arrVertical;
    }

    function findMissingIndex(arr) {
        let arrOfMissingIndex = [];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === 0) {
                arrOfMissingIndex.push(i);
            }
        }
        return arrOfMissingIndex;
    }

    function getSquareArr(matrix, rowNum, colNum) {
//           rowNum, colNum - row and column coordinates
        let rowSquareNum = Math.floor(rowNum / 3);
        let colSquareNum = Math.floor(colNum / 3);
        let arrOfSquareNum = [];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                arrOfSquareNum.push(matrix[rowSquareNum * 3 + i][colSquareNum * 3 + j]);
            }

        }
        return arrOfSquareNum;
    }


    function simpleInsert(matrix) {

        let inserted = false;

//    search in horizontal

        for (let i = 0; i < matrix.length; i++) {
            let currentArr = matrix[i];
            let missingNumbers = findMissingNumbers(currentArr);
            let missingIndexes = findMissingIndex(currentArr);

//        for missingNumbers, each of the missing numbers
            for (let k = 0; k < missingNumbers.length; k++) {
                let missNum = missingNumbers[k];
                let counter = 0;
                let lastIndex = null;

                //        look for lines perpendicular to the current
                for (let j = 0; j < missingIndexes.length; j++) {
                    let currentRowIndex = missingIndexes[j];
                    let arrayPerpendicular = arrFromVertical(matrix, currentRowIndex);

                    if (arrayPerpendicular.indexOf(missNum) === -1) {
                        // Check squared availability

                        let arrSquareNums = getSquareArr(matrix, i, currentRowIndex);

                        if (arrSquareNums.indexOf(missNum) === -1) {
                            counter++;
                            lastIndex = currentRowIndex;
                        }

                    }
                }

                if (counter === 1) {
                    matrix[i][lastIndex] = missNum;

                    inserted = true;
                }


            }

        }


//    search by vertical

        for (let i = 0; i < matrix.length; i++) {
            let currentArr = arrFromVertical(matrix, i);
            let missingNumbers = findMissingNumbers(currentArr);
            let missingIndexes = findMissingIndex(currentArr);

//        for missingNumbers, each of the missing numbers

            for (let k = 0; k < missingNumbers.length; k++) {
                let missNum = missingNumbers[k];
                let counter = 0;
                let lastIndex = null;

                //        look for lines perpendicular to the current
                for (let j = 0; j < missingIndexes.length; j++) {
                    let currentRowIndex = missingIndexes[j];
                    let arrayPerpendicular = matrix[currentRowIndex];

                    if (arrayPerpendicular.indexOf(missNum) === -1) {
                        let arrSquareNums = getSquareArr(matrix, currentRowIndex, i);

                        if (arrSquareNums.indexOf(missNum) === -1) {
                            counter++;
                            lastIndex = currentRowIndex;
                        }
                    }
                }

                if (counter === 1) {
                    matrix[lastIndex][i] = missNum;

                    inserted = true;
                }

            }

        }
        if (inserted) {
            matrix = simpleInsert(matrix);
        }


        return matrix;
    }



    function randomInsert(matrix) {
        let matrixCopy = cloneArray(matrix);
        let maxCountNum = maxCountNumber(matrix);

        for (let i = 0; i < matrix.length; i++) {
            let row = matrix[i];
            if (row.indexOf(maxCountNum) !== -1) {
                continue;
            }

            let arrOfMissIndexes = findMissingIndex(row);

            if (arrOfMissIndexes.length === 0) {
                continue;
            }

            let indexesToInsert = [];


            for (let j = 0; j < arrOfMissIndexes.length; j++) {
                let currentMissIndex = arrOfMissIndexes[j];
                let currentVerticalArr = arrFromVertical(matrix, currentMissIndex);

                let squareNums = getSquareArr(matrix, i, currentMissIndex);


                if (currentVerticalArr.indexOf(maxCountNum) === -1 && squareNums.indexOf(maxCountNum) === -1) {
                    indexesToInsert.push(currentMissIndex);
                }
            }
            if (indexesToInsert.length === 0) {
                return matrixCopy;
            }

            let random = getRandomInt(0, indexesToInsert.length);
            let indexToInsert = indexesToInsert[random];
            matrix[i][indexToInsert] = maxCountNum;

        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        return matrix;
    }


    function countOne(matrix, num) {
        let count = 0;

        for (let i = 0; i < matrix.length; i++) {
            let row = matrix[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] === num) {
                    count++;
                }
            }
        }
        return count;
    }

    function maxCountNumber(matrix) {
        let number;
        let lastCount = 0;

        for (let i = 1; i < 10; i++) {
            let count = countOne(matrix, i);
            if (count > lastCount && count !== 9) {
                number = i;
                lastCount = count;
            }
        }

        return number;
    }

    function cloneArray(myArray) {
        return myArray.map(a => Object.assign([], a));
    }


    matrix = simpleInsert(matrix);
    let matrixClone = cloneArray(matrix);


    let counter = 0;
    let zerosCount = null;
    do {
        matrix = cloneArray(matrixClone);
        do {
            zerosCount = countOne(matrix, 0);
            matrix = randomInsert(matrix);
            matrix = simpleInsert(matrix);
        } while (countOne(matrix, 0) !== zerosCount);
        counter++;
    } while (zerosCount !== 0 && counter < 100);


    return matrix;
}
