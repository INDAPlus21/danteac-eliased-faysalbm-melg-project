# xor for exclusive or, meaning that [1, 0] = 1, [0, 1] = 1, [0, 0] = 0, [1, 1] = 0
# "a classification problem, so fits supervised learning"
# feedforward networks AS OPPOSED TO connecting the input layers with eachother (???)
# haha. in xor 100% of training data is available, no risk of overfitting here

# interesting. you can define an xor function like xor(a, b) = a * b + b * a
''' def xor(a, b): **2 
    return a * (not b) + b * (not a)
    # alternatively (a + b) * (not a*b)

def test_xor():
    print(xor(1, 1) == 0)
    print(xor(1, 0) == 1)
    print(xor(0, 1) == 1)  
    print(xor(0, 0) == 0)

test_xor() # yes works :P  '''

# based on
# lots to improve on, which is why I chose it --> https://medium.com/analytics-vidhya/coding-a-neural-network-for-xor-logic-classifier-from-scratch-b90543648e8a
# excellent article --> https://towardsdatascience.com/how-neural-networks-solve-the-xor-problem-59763136bdd7

import numpy as np
import matplotlib.pyplot as plt

train_ex = np.array([[0, 0], [0, 1], [1, 0], [1, 1]]) # np.array([[0, 0, 1, 1], [0, 1, 0, 1]])
target = np.array([0, 1, 1, 0]) # np.array([[0, 1, 1, 0]])  # expected output

n_hidden_neurons = 2  # but only one layer, two neurons are needed bc both NOT AND and OR need to be implemented, xor is two-dimensional logic

# shape property is a tuple shape of np array, in this case (2, 4)
n_train_ex = train_ex.shape[1]

learning_rate = 0.9
epochs = 1000

# if not set different random numbers will be generated each run
np.random.seed(2)

# you could also define these yourself, would be the same result
# weights are updated during training
# zero initialized weights don't seem to work (?)
# "hidden layers allow for non-linearity"
# linear functions apparently hinder learning complex data
# uniform is better because it approaches faster?
hidden_weights = np.random.rand(n_hidden_neurons, len(train_ex))  # np.random.uniform( size=(len(train_ex), n_hidden_neurons)) # np.array([[0, 0], [0, 0]])
# hidden_bias = np.random.uniform(size=(1, n_hidden_neurons*2))
# np.random.uniform(size=(n_hidden_neurons, len(target)))
output_weights = np.random.rand(len(target), n_hidden_neurons)
# output_bias = np.random.uniform(size=(2, len(target)*4))
#  # np.array([[0, 0]])
print("hidden", hidden_weights, "output", output_weights)

# the sigmoid (activation) function is used to shrink the range to 0-1
# this can be interpreted as the probability of it being 0 or 1 (the binary values we try to predict)
# yeah right, the sigmoid function is heavily scewed towards the tail ends (0 and 1)


def sigmoid(z):
    return 1/(1+np.exp(-z))


def forward_prop(hidden_weights, output_weights, input):
    z1 = hidden_weights.dot(input)  # + hidden_bias
    activ_1 = sigmoid(z1)
    z2 = output_weights.dot(activ_1)  # + output_bias
    predicted_output = sigmoid(z2)
    return activ_1, predicted_output

# each parameter should change in proportion to its effect on the output/error
# weights with small effects shouldn't change, weights with large negative effects should


def back_prop(n_train_ex, activ_1, predicted_output, target):
    global hidden_weights
    global output_weights

    error = predicted_output-target
    diff_output_w = error.dot(activ_1.T)/n_train_ex
    dz1 = output_weights.T.dot(error) * activ_1 * (1-activ_1) # is THIS node * (actual - computed)
    diff_hidden_w = dz1.dot(train_ex.T)/n_train_ex

    # update weights (and potentially biases later)
    output_weights = output_weights-learning_rate*diff_output_w
    hidden_weights = hidden_weights-learning_rate*diff_hidden_w
    return output_weights, hidden_weights


def train(epochs):
    losses = []
    for _ in range(epochs):
        activ_1, predicted_output = forward_prop(
            hidden_weights, output_weights, train_ex)
        # if i % 1000 == 0:
        # print("z1: ", z1, "a1: ", a1, "z2: ", z2, "a2: ", a2)
        loss = -(1/n_train_ex)*np.sum(target * np.log(predicted_output)+(1-target)*np.log(1-predicted_output))
        losses.append(loss)
        back_prop(n_train_ex, activ_1, predicted_output, target)
    return losses


losses = train(epochs)

plt.plot(losses)
plt.xlabel("EPOCHS")
plt.ylabel("Loss value")
# plt.show() # why exactly is the loss function not 0 when it always predicts correctly? 

def predict(tests):
    for test in tests:
        _, activ_2 = forward_prop(hidden_weights, output_weights, test)
        # squeeze removes the unneccessary nested layers
        activ_2 = np.squeeze(activ_2)
        if activ_2 >= 0.5:  # as already mentioned, the sigmoid function is interpreted as probability
            print([i[0] for i in test], "-->", 1)  # just formatting
        else:
            print([i[0] for i in test], "-->", 0)


tests = np.array([[[1], [0]], [[0], [1]], [[0], [0]], [[1], [1]]])
predict(tests)
