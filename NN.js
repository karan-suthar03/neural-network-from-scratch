function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
    return y * (1 - y);
}

function tanh(x) {
    return Math.tanh(x);
}

function dtanh(y) {
    return 1 - y * y;
}
function nothing(x) {
    return x;
}

function dnothing(y) {
    return 1;
}

function reLu(x) {
    return Math.max(0, x);
}

function dReLu(y) {
    return y > 0 ? 1 : 0;
}

function leakyReLu(x) {
    return x > 0 ? x : 0.01 * x;
}

function dLeakyReLu(y) {
    return y > 0 ? 1 : 0.01;
}

class NN{
    constructor(layers,learning_rate = 0.001) {
        this.layers = layers;
        this.weights = [];
        this.biases = [];
        this.learning_rateh = 0.005;
        this.learning_rateo = 0.001;
        for(let i = 0; i < this.layers.length - 1; i++) {
            this.weights.push(new Matrix(this.layers[i + 1], this.layers[i]).randomize());
            this.biases.push(new Matrix(this.layers[i + 1], 1).randomize());
        }
        this.hActivation = tanh;
        this.hDerivative = dtanh;
        this.activation = nothing;
        this.derivative = dnothing;
    }
    feedforward(input_array) {
        let inputs = Matrix.fromArray(input_array);
        for(let i = 0; i < this.weights.length; i++) {
            if(i === this.weights.length - 1) {
                inputs = Matrix.multiply(this.weights[i], inputs).add(this.biases[i]).map(this.activation);
            }else{
                inputs = Matrix.multiply(this.weights[i], inputs).add(this.biases[i]).map(this.hActivation);
            }
        }
        return inputs.toArray();
    }
    train(input_array, target_array) {
        let inputs = Matrix.fromArray(input_array);
        let targets = Matrix.fromArray(target_array);
        let outputs = [];
        let hidden = [];
        for(let i = 0; i < this.weights.length; i++) {
            if(i === this.weights.length - 1) {
                outputs.push(Matrix.multiply(this.weights[i], inputs).add(this.biases[i]).map(this.activation));
            }else{
                outputs.push(Matrix.multiply(this.weights[i], inputs).add(this.biases[i]).map(this.hActivation));
            }
            hidden.push(inputs);
            inputs = outputs[i];
        }
        let errors = [];
        let gradients = [];
        let deltas = [];
        let weights = this.weights.slice();
        for(let i = this.weights.length - 1; i >= 0; i--) {
            if(i === this.weights.length - 1) {
                errors.push(Matrix.subtract(targets, outputs[i]));
            } else {
                errors.push(Matrix.multiply(Matrix.transpose(weights[i + 1]), errors[errors.length - 1]));
            }
            if(i === this.weights.length - 1) {
                gradients.push(Matrix.map(outputs[i], this.derivative).multiply(errors[errors.length - 1]).multiply(this.learning_rateo));
            }
            else {
                gradients.push(Matrix.map(outputs[i], this.hDerivative).multiply(errors[errors.length - 1]).multiply(this.learning_rateh));
            }
            deltas.push(Matrix.multiply(gradients[gradients.length - 1], Matrix.transpose(hidden[i])));
        }
        for(let i = this.weights.length - 1; i >= 0; i--) {
            this.weights[i] = this.weights[i].add(deltas[this.weights.length - 1 - i]);
            this.biases[i] = this.biases[i].add(gradients[this.weights.length - 1 - i]);
        }
    }
}