# xor for exclusive or, meaning that [1, 0] = 1, [0, 1] = 1, [0, 0] = 0, [1, 1] = 0
# "a classification problem, so fits supervised learning"
# feedforward networks AS OPPOSED TO connecting the input layers with eachother (???)
# haha. in xor 100% of training data is available, no risk of overfitting here
# BIAS for inactivity (!), weight tell you pattern, bias tells you threshold 

# interesting. you can define an xor function like xor(a, b) = a * b + b * a
''' def xor(a, b): **2 
    return a * (not b) + b * (not a)
    # alternatively (a + b) * (not a*b)

def test_xor():
    print(xor(1, 1) == 0)
    print(xor(1, 0) == 1)
    print(xor(0, 1) == 1)      print(xor(0, 1) == 1)  

    print(xor(0, 0) == 0)

test_xor() # yes works :P  '''

# based on
# lots to improve on, which is why I chose it --> https://medium.com/analytics-vidhya/coding-a-neural-network-for-xor-logic-classifier-from-scratch-b90543648e8a
# excellent article --> https://towardsdatascience.com/how-neural-networks-solve-the-xor-problem-59763136bdd7

import numpy as np
import matplotlib.pyplot as plt


def sigmoid(z):
    return 1/(1+np.exp(-z))


def plot(losses):
    plt.plot(losses)
    plt.xlabel("Epochs")
    plt.ylabel("Loss")
    plt.show() # why exactly is the loss function not 0 when it always predicts correctly?


class NN:
    def __init__(self):
        self.train_ex = np.array([[0, 0, 1, 1], [0, 1, 0, 1]]) # np.array([[0, 0], [0, 1], [1, 0], [1, 1]]) 
        self.target = np.array([[0, 1, 1, 0]])  # np.array([0, 1, 1, 0])  # expected output #

        self.n_target = len(self.target)
        self.n_hidden_neurons = 2  # but only one layer, two neurons are needed bc both NOT AND and OR need to be implemented, xor is two-dimensional logic
        self.n_train_ex = self.train_ex.shape[1]  # shape property is a tuple shape of np array, in this case (2, 4)
        self.learning_rate = 0.1
        self.epochs = 1

        np.random.seed(2)  # if not set different random numbers will be generated each run

        self.hidden_weights = np.random.rand(self.n_hidden_neurons, 1) # len(self.train_ex))  # np.random.uniform( size=(len(train_ex), n_hidden_neurons)) # np.array([[0, 0], [0, 0]])
        # yes, output should be one-dimensional
        # self.output_weights = np.random.rand(self.n_hidden_neurons, len(self.target))  # np.random.rand(1, 4)
        self.output_weights = np.random.rand(len(self.target), self.n_hidden_neurons)  # np.random.rand(1, 4)
        print("hidden", self.hidden_weights, "output", self.output_weights)

    def forward_prop(self, train_ex):
        # okay, so the 4 different values in each hidden neuron represents the probability of it being 0, 1, 1, 0
        print("hidden:", self.hidden_weights, "train:", train_ex)
        dot_hidden = self.hidden_weights.dot(train_ex)  # + hidden_bias # acts as input
        print("dot_product", dot_hidden)
        activ_1 = sigmoid(dot_hidden)  # acts as output # aha! detta e också en array av samma dimensioner som z1, och det makar sense eftersom den ska vara en activation för VARJE nod i matrisen!
        print("activ1", activ_1, "output", self.output_weights)
        # det blir matrismultiplation här också, fast... # + output_bias # aha! det är att output weights blir modifierade av aktiveringen! (genom nätverket)
        dot_output = self.output_weights.dot(activ_1)
        print("dot_product_2", dot_output)  # okay, this dot product has the same "form" as the output array
        predicted_output = sigmoid(dot_output)  # aha! it processes all training data at the same time!
        print("predicted output", predicted_output)
        return activ_1, predicted_output

    def back_prop(self, predicted_output, activ_1):
        # HOW is this related to chain rules ?!?!?!? 
        error = predicted_output-self.target  # aha! det är så man får error för varje indivudell nod! och det har är automatiskt en numpy subtraktion
        diff_output_w = error.dot(activ_1.T)/self.n_train_ex  # .T är den transponerade arrayen
        dz1 = self.output_weights.T.dot(error) * activ_1 * (1-activ_1)  # is THIS node * (actual - computed)
        diff_hidden_w = dz1.dot(self.train_ex.T)/self.n_train_ex

        # update weights (and potentially biases later)
        self.output_weights = self.output_weights-self.learning_rate*diff_output_w
        self.hidden_weights = self.hidden_weights-self.learning_rate*diff_hidden_w

    def train(self):
        losses = []
        for _ in range(self.epochs):
            activ_1, predicted_output = self.forward_prop(self.train_ex)
            # if i % 1000 == 0:
            # print("z1: ", z1, "a1: ", a1, "z2: ", z2, "a2: ", a2)
            # jag har hittat loss-funktionen!
            # mean squared error, and sum and devide to get a scalar, and it looks "worse" than the binary cross-entropy because it doesn't use log  
            loss = (1/self.n_target)*np.sum((1/self.n_train_ex)*(np.square(predicted_output-self.target))) 
            # print("loss", loss)
            losses.append(loss)
            self.back_prop(predicted_output, activ_1)
        return losses

    def predict(self, tests):
        for test in tests:
            _, activ_2 = self.forward_prop(test)
            activ_2 = np.squeeze(activ_2)  # squeeze removes the unneccessary nested layers
            if activ_2 >= 0.5:  # as already mentioned, the sigmoid function is interpreted as probability
                print([i[0] for i in test], "-->", 1)  # just formatting
            else:
                print([i[0] for i in test], "-->", 0)


xor_nn = NN()
losses = xor_nn.train()
# print(losses)
# plot(losses)
tests = np.array([[[1], [0]], [[0], [1]], [[0], [0]], [[1], [1]]])
xor_nn.predict(tests)
