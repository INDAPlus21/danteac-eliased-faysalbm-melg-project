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

"Note that when the input z is a vector or Numpy array, Numpy automatically applies the function sigmoid elementwise, that is, in vectorized form."
def sigmoid(z):
    return 1/(1+np.exp(-z))

def sigmoid_prime(z): 
    return sigmoid(z)*(1-sigmoid(z))


def plot(losses):
    plt.plot(losses)
    plt.xlabel("Epochs")
    plt.ylabel("Loss")
    plt.show()  # why exactly is the loss function not 0 when it always predicts correctly?


class NN:
    def __init__(self):
        self.train_ex = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])  # np.array([[0, 0, 1, 1], [0, 1, 0, 1]])
        self.target = np.array([0, 1, 1, 0])  # np.array([0, 1, 1, 0])  # expected output #

        self.n_inputs = self.train_ex.shape[1]
        self.n_target = len(self.target)
        self.n_hidden_neurons = 2  # but only one layer, two neurons are needed bc both NOT AND and OR need to be implemented, xor is two-dimensional logic
        self.n_train_ex = self.train_ex.shape[1]  # shape property is a tuple shape of np array, in this case (2, 4)
        self.learning_rate = 0.1
        self.epochs = 10000

        np.random.seed(2)  # if not set different random numbers will be generated each run

        self.hidden_weights = np.random.rand(self.n_hidden_neurons, self.n_inputs)  # len(self.train_ex))  # np.random.uniform( size=(len(train_ex), n_hidden_neurons)) # np.array([[0, 0], [0, 0]])
        # yes, output should be one-dimensional
        # self.output_weights = np.random.rand(self.n_hidden_neurons, len(self.target))  # np.random.rand(1, 4)
        # okay... kinda makes sense that the output will have an entire weightn matrix
        # first value in the nested array symbolizing the probability of and, the other of or
        # and the 4 values are bc there are 4 possible outputs. this is starting to make sense (if I'm not delusional)
        # no they SHOULD have two weights?!?!? whY!?!!?
        # aha!!!! because the inputs really ARE two dimensional (although you're here kinda treating them as 1)
        # watch --> https://www.youtube.com/watch?v=kNPGXgzxoHw
        # watch --> https://www.youtube.com/watch?v=s7nRWh_3BtA
        # aha! the output "neuron" is ALSO going to apply the identical sigmoid function with
        # the previous two neurons as input
        # confusing because you're trying to do two things at once
        self.output_weights = np.random.rand(1, 2)  # np.random.rand(1, 4)
        print("hidden", self.hidden_weights, "output", self.output_weights)

    def forward_prop(self, one_train_ex):
        one_train_ex = np.array(one_train_ex)
        # okay, so the 4 different values in each hidden neuron represents the probability of it being 0, 1, 1, 0
        # print("in forward prop, hidden:", self.hidden_weights, "train:", one_train_ex)
        dot_hidden = one_train_ex.dot(self.hidden_weights)  # + hidden_bias # acts as input
        # print("dot_product", dot_hidden)
        # aha! 0 blir 0.5 med sigmoid # acts as output # aha! detta e också en array av samma dimensioner som z1, och det makar sense eftersom den ska vara en activation för VARJE nod i matrisen!
        activ_1 = np.expand_dims(sigmoid(dot_hidden), axis=0)
        # print("activ1", activ_1, "output", self.output_weights)
        # det blir matrismultiplation här också, fast... # + output_bias # aha! det är att output weights blir modifierade av aktiveringen! (genom nätverket)
        dot_output = np.dot(self.output_weights, activ_1.T)  # .dot(activ_1)
        # print("dot_output", dot_output)  # okay, this dot product has the same "form" as the output array

        # sigmoid_v = np.vectorize(sigmoid)
        # predicted_output = sigmoid_v(dot_output) # # aha! it processes all training data at the same time!
        predicted_output = sigmoid(dot_output)
        # print("predicted output", predicted_output)
        return activ_1, predicted_output

    def back_prop(self, predicted_output, activ_1, one_train_ex, one_target, i):
        # one_target = np.expand_dims(np.expand_dims(one_target, axis=0), axis=0)
        # HOW is this related to chain rules ?!?!?!?
        error = predicted_output-one_target  # aha! det är så man får error för varje indivudell nod! och det har är automatiskt en numpy subtraktion
        # print("error", error, "active_1", activ_1) # , "one_target", one_target, "one_train_ex")
        diff_output_w = np.dot(error, activ_1/self.n_train_ex)  # .T är den transponerade arrayen
        # print("diff_output_w", diff_output_w)

        # activ_1 * (1-activ_1) IS THE DERIVATIVE OF SIGMOID!!!
        # and this looks much simpler because it's only one layer?
        # yes, and it's the error for the very first layer
        # but shouldn't you multiple everything even for just one training example?
        dz1 = np.dot(error, self.output_weights) * activ_1 * (1-activ_1)  # is THIS node * (actual - computed)
        # print("dz1", dz1)
        diff_hidden_w = np.dot(dz1, one_train_ex)
        # print("diff_hidden_w", diff_hidden_w)
        return diff_output_w, diff_hidden_w

    def train(self):
        losses = []
        diff_output_w = 0 
        diff_hidden_w = 0
        for _ in range(self.epochs):
            i = 0
            for one_train_ex in self.train_ex:
                # print("one train ex", one_train_ex)
                activ_1, predicted_output = self.forward_prop(one_train_ex)
                # if i % 1000 == 0:
                # print("z1: ", z1, "a1: ", a1, "z2: ", z2, "a2: ", a2)
                # jag har hittat loss-funktionen!dot
                # mean squared error, and sum and devide to get a scalar, and it looks "worse" than the binary cross-entropy because it doesn't use log
                # print("target", self.target, "predicted_output", predicted_output)
                loss = (1/self.n_target)*np.sum((1/self.n_train_ex)*(np.square(predicted_output-self.target)))
                # print("loss", loss)
                losses.append(loss)
                one_diff_output_w, one_diff_hidden_w = self.back_prop(predicted_output, activ_1, one_train_ex, self.target[i], i)
                i += 1
                diff_output_w += one_diff_output_w
                diff_hidden_w += one_diff_hidden_w

            # update weights (and potentially biases later)
            self.output_weights = self.output_weights-self.learning_rate*(diff_output_w/self.n_train_ex)
            self.hidden_weights = self.hidden_weights-self.learning_rate*(diff_hidden_w/self.n_train_ex)
        return losses

    def predict(self, tests):
        for test in tests:
            _, activ_2 = self.forward_prop(test)
            activ_2 = np.squeeze(activ_2)  # squeeze removes the unneccessary nested layers
            if activ_2 >= 0.5:  # as already mentioned, the sigmoid function is interpreted as probability
                print(test, "-->", 1)  # just formatting
            else:
                print(test, "-->", 0)


xor_nn = NN()
losses = xor_nn.train()
# plot(losses)
tests = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
xor_nn.predict(tests)
