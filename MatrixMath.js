class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = Array.from({length: rows}, () => Array(cols).fill(0));
    }

    randomize() {
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                this.data[i][j] = Math.random()*2 - 1;
            }
        }
        return this;
    }

    static multiply(a, b) {
        if(a.cols === b.rows){
            let newMatrix = new Matrix(a.rows, b.cols);
            for(let i = 0; i < a.rows; i++) {
                for(let j = 0; j < b.cols; j++) {
                    let sum = 0;
                    for(let k = 0; k < a.cols; k++) {
                        sum += a.data[i][k] * b.data[k][j];
                    }
                    newMatrix.data[i][j] = sum;
                }
            }
            return newMatrix;
        }else{
            console.log('Error: The number of columns of the first matrix must be equal to the number of rows of the second matrix');
        }
    }

    multiply(n) {
        if(n instanceof Matrix) {
            if(this.rows !== n.rows || this.cols !== n.cols) {
                console.log('Error: The number of rows and columns of the matrices must be the same');
                return;
            }
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    this.data[i][j] *= n.data[i][j];
                }
            }
        } else if(typeof n === 'number') {
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    this.data[i][j] *= n;
                }
            }
        }
        return this;
    }

    add(n) {
        if(n instanceof Matrix) {
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    this.data[i][j] += n.data[i][j];
                }
            }
        } else if(typeof n === 'number') {
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < this.cols; j++) {
                    this.data[i][j] += n;
                }
            }
        } else {
            console.log('Error: The argument must be a number or a Matrix');
        }
        return this;
    }

    static transpose(a) {
        let result = new Matrix(a.cols, a.rows);
        for(let i = 0; i < a.rows; i++) {
            for(let j = 0; j < a.cols; j++) {
                result.data[j][i] = a.data[i][j];
            }
        }
        return result;
    }

    map(func) {
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                let val = this.data[i][j];
                this.data[i][j] = func(val);
            }
        }
        return this;
    }

    static map(matrix, func) {
        let result = new Matrix(matrix.rows, matrix.cols);
        for(let i = 0; i < matrix.rows; i++) {
            for(let j = 0; j < matrix.cols; j++) {
                let val = matrix.data[i][j];
                result.data[i][j] = func(val);
            }
        }
        return result;
    }

    static fromArray(input_array) {
        let m = new Matrix(input_array.length, 1);
        for(let i = 0; i < input_array.length; i++) {
            m.data[i][0] = input_array[i];
        }
        return m;
    }

    toArray(){
        let arr = [];
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                arr.push(this.data[i][j]);
            }
        }
        return arr;
    }

    static subtract(targets, outputs) {
        let result = new Matrix(targets.rows, targets.cols);
        for(let i = 0; i < targets.rows; i++) {
            for(let j = 0; j < targets.cols; j++) {
                result.data[i][j] = targets.data[i][j] - outputs.data[i][j];
            }
        }
        return result;
    }
    print(){
        console.table(this.data);
    }
}