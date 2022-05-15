import numpy as np
import pandas as pd
import matplotlib as plt
df = pd.read_csv('SBUX.csv', index_col = 'Date', parse_dates=True)

df.head(5)

plt.style.use('ggplot')
df['Volume'].plot(label='CLOSE', title='Star Bucks Stock Volume')
