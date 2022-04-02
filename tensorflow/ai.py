import collections
import datetime
#import fluidsynth
import glob
import numpy as np
import pathlib
import pandas as pd
import pretty_midi
import seaborn as sns
import tensorflow as tf
import pygame

#from IPython import display
from matplotlib import pyplot as plt
from typing import Dict, List, Optional, Sequence, Tuple

# Play MIDI
def play_music(music_file):
    clock = pygame.time.Clock()
    try:
        pygame.mixer.music.load(music_file)
        print("Music file %s loaded!" % music_file) 
    except pygame.error:
        print("File %s not found! (%s)" % (music_file, pygame.get_error())) 
        return
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        # check if playback has finished
        clock.tick(30)

seed = 42
tf.random.set_seed(seed)
np.random.seed(seed)

# Sampling rate for audio playback
_SAMPLING_RATE = 16000

# Dataset
data_dir = pathlib.Path('data/maestro-v2.0.0')
if not data_dir.exists():
  tf.keras.utils.get_file(
      'maestro-v2.0.0-midi.zip',
      origin='https://storage.googleapis.com/magentadata/datasets/maestro/v2.0.0/maestro-v2.0.0-midi.zip',
      extract=True,
      cache_dir='.', cache_subdir='data',
  )

filenames = glob.glob(str(data_dir/'**/*.mid*'))
sample_file = filenames[1]
pm = pretty_midi.PrettyMIDI(sample_file)
print(pm.instruments)
print(pm.lyrics)

"""try:
  #play_music(sample_file)
except KeyboardInterrupt:
    # if user hits Ctrl/C then exit
    # (works only in console mode)
    pygame.mixer.music.fadeout(1000)
    pygame.mixer.music.stop()
    raise SystemExit"""


# pick a midi music file you have ...
# (if not in working folder use full path)

#midi_file = './bohemian.mid'
#freq = 44100    # audio CD quality
#bitsize = -16   # unsigned 16 bit
#channels = 2    # 1 is mono, 2 is stereo
#buffer = 1024    # number of samples
#pygame.mixer.init(freq, bitsize, channels, buffer)

# optional volume 0 to 1.0
#pygame.mixer.music.set_volume(0.8)
#try:
#    play_music(midi_file)
#except KeyboardInterrupt:
    # if user hits Ctrl/C then exit
    # (works only in console mode)
    #pygame.mixer.music.fadeout(1000)
    #pygame.mixer.music.stop()
    #raise SystemExit"""