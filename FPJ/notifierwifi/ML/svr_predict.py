import sys
import numpy as np
import pickle
from sklearn import linear_model

if len(sys.argv) != 4:
	print('Usage :', sys.argv[0], 'signal_7 signal_12 signal_13')
	exit(1)

test = np.array([[float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3])]])


model = pickle.load(open('svr_model_x', 'rb'))
print(model.predict(test)[0])

model = pickle.load(open('svr_model_y', 'rb'))
print(model.predict(test)[0])
