import collections
# import datetime
# import fluidsynth
import glob
import numpy as np
import pathlib
import pandas as pd
import pretty_midi
import seaborn as sns
import tensorflow as tf

# from IPython import display
from matplotlib import pyplot as plt
from typing import Dict, List, Optional, Sequence, Tuple
# import sdl2

import pygame
# import signal
import sys
import os
# from mido import MidiFile
# import time

# https://www.twilio.com/blog/working-with-midi-data-in-python-using-mido

# pick a midi music file you have ...
# (if not in working folder use full path)
# it's a blocking call (remember that!)
def play_midi(midi_file):
    print("playing midi")
    freq = 44100    # audio CD quality
    bitsize = -16   # unsigned 16 bit
    channels = 2  # 1 is mono, 2 is stereo
    buffer = 1024    # number of samples
    pygame.mixer.init(freq, bitsize, channels, buffer)
    
    # optional volume 0 to 1.0
    # pygame.mixer.music.set_volume(1) # default is 1

    clock = pygame.time.Clock()
    try:
        pygame.mixer.music.load(midi_file)
        print("Music file %s loaded!" % midi_file) 
    except pygame.error:
        print("File %s not found! (%s)" % (midi_file, pygame.get_error())) 
        return
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        # check if playback has finished
        clock.tick(30)

# put all the function calls in main 
def main(): 
    seed = 42
    tf.random.set_seed(seed)
    np.random.seed(seed)

    # Sampling rate for audio playback
    _SAMPLING_RATE = 16000

    data_dir = pathlib.Path('data/maestro-v2.0.0')
    if not data_dir.exists():
        tf.keras.utils.get_file(
            'maestro-v2.0.0-midi.zip',
            origin='https://storage.googleapis.com/magentadata/datasets/maestro/v2.0.0/maestro-v2.0.0-midi.zip',
            extract=True,
            cache_dir='.', cache_subdir='data',
        )

    filenames = glob.glob(str(data_dir/'**/*.mid*'))
    print('Number of files:', len(filenames))

    sample_file = filenames[1]
    print(sample_file)

    pm = pretty_midi.PrettyMIDI(sample_file)

    # sdl2.SDL_Init(sdl2.SDL_INIT_VIDEO)

    # def display_audio(pm: pretty_midi.PrettyMIDI, seconds=30):
    #   waveform = pm.fluidsynth(fs=_SAMPLING_RATE)
    #   # Take a sample of the generated waveform to mitigate kernel resets
    #   waveform_short = waveform[:seconds*_SAMPLING_RATE]
    #   return display.Audio(waveform_short, rate=_SAMPLING_RATE)

    # display_audio(pm)

    print('Number of instruments:', len(pm.instruments))
    instrument = pm.instruments[0]
    instrument_name = pretty_midi.program_to_instrument_name(instrument.program)
    print('Instrument name:', instrument_name)

    # cv1 = MidiFile('new_song.mid', clip=True)
    # cv1 = MidiFile('bohemian.mid', clip=True)
    # cv3 = MidiFile('VampireKillerCV3.mid', clip=True)

    # del cv1.tracks[4]
    # del cv1.tracks[4]

    # cv1.tracks.append(cv3.tracks[4])
    # cv1.tracks.append(cv3.tracks[5])

    # cv1.save('mashup.mid')

    # play_midi(sample_file)

    for i, note in enumerate(instrument.notes[:10]):
        note_name = pretty_midi.note_number_to_name(note.pitch)
        duration = note.end - note.start
        print(f'{i}: pitch={note.pitch}, note_name={note_name},'
                f' duration={duration:.4f}')

    def midi_to_notes(midi_file: str) -> pd.DataFrame:
        pm = pretty_midi.PrettyMIDI(midi_file)
        instrument = pm.instruments[0]
        notes = collections.defaultdict(list)

        # Sort the notes by start time
        sorted_notes = sorted(instrument.notes, key=lambda note: note.start)
        prev_start = sorted_notes[0].start

        for note in sorted_notes:
            start = note.start
            end = note.end
            notes['pitch'].append(note.pitch)
            notes['start'].append(start)
            notes['end'].append(end)
            notes['step'].append(start - prev_start)
            notes['duration'].append(end - start)
            prev_start = start

        return pd.DataFrame({name: np.array(value) for name, value in notes.items()})

    raw_notes = midi_to_notes(sample_file)
    raw_notes.head()

    get_note_names = np.vectorize(pretty_midi.note_number_to_name)
    sample_note_names = get_note_names(raw_notes['pitch'])
    sample_note_names[:10]

    def plot_piano_roll(notes: pd.DataFrame, count: Optional[int] = None):
        if count:
            title = f'First {count} notes'
        else:
            title = f'Whole track'
            count = len(notes['pitch'])
        plt.figure(figsize=(20, 4))
        plot_pitch = np.stack([notes['pitch'], notes['pitch']], axis=0)
        plot_start_stop = np.stack([notes['start'], notes['end']], axis=0)
        plt.plot(
            plot_start_stop[:, :count], plot_pitch[:, :count], color="b", marker=".")
        plt.xlabel('Time [s]')
        plt.ylabel('Pitch')
        _ = plt.title(title)

    # plot_piano_roll(raw_notes, count=100)

    # plot_piano_roll(raw_notes)

    def notes_to_midi(
      notes: pd.DataFrame,
      out_file: str, 
      instrument_name: str,
      velocity: int = 100,  # note loudness
    ) -> pretty_midi.PrettyMIDI:

      pm = pretty_midi.PrettyMIDI()
      instrument = pretty_midi.Instrument(
          program=pretty_midi.instrument_name_to_program(
              instrument_name))

      prev_start = 0
      for i, note in notes.iterrows():
        start = float(prev_start + note['step'])
        end = float(start + note['duration'])
        note = pretty_midi.Note(
            velocity=velocity,
            pitch=int(note['pitch']),
            start=start,
            end=end,
        )
        instrument.notes.append(note)
        prev_start = start

      pm.instruments.append(instrument)
      pm.write(out_file)
      return pm 

    example_file = 'example.midi'
    example_pm = notes_to_midi(
        raw_notes, out_file=example_file, instrument_name=instrument_name)
    
    # play_midi(example_file)

    num_files = 5
    all_notes = []
    for f in filenames[:num_files]:
      notes = midi_to_notes(f)
      all_notes.append(notes)

    all_notes = pd.concat(all_notes)

    n_notes = len(all_notes)
    print('Number of notes parsed:', n_notes)

    key_order = ['pitch', 'step', 'duration']
    train_notes = np.stack([all_notes[key] for key in key_order], axis=1)

    notes_ds = tf.data.Dataset.from_tensor_slices(train_notes)
    notes_ds.element_spec

    def create_sequences(
        dataset: tf.data.Dataset, 
        seq_length: int,
        vocab_size = 128,
    ) -> tf.data.Dataset:
      """Returns TF Dataset of sequence and label examples."""
      seq_length = seq_length+1

      # Take 1 extra for the labels
      windows = dataset.window(seq_length, shift=1, stride=1,
                                  drop_remainder=True)

      # `flat_map` flattens the" dataset of datasets" into a dataset of tensors
      flatten = lambda x: x.batch(seq_length, drop_remainder=True)
      sequences = windows.flat_map(flatten)

      # Normalize note pitch
      def scale_pitch(x):
        x = x/[vocab_size,1.0,1.0]
        return x

      # Split the labels
      def split_labels(sequences):
        inputs = sequences[:-1]
        labels_dense = sequences[-1]
        labels = {key:labels_dense[i] for i,key in enumerate(key_order)}

        return scale_pitch(inputs), labels

      return sequences.map(split_labels, num_parallel_calls=tf.data.AUTOTUNE)

    seq_length = 25
    vocab_size = 128
    seq_ds = create_sequences(notes_ds, seq_length, vocab_size)
    seq_ds.element_spec

    for seq, target in seq_ds.take(1):
        print('sequence shape:', seq.shape)
        print('sequence elements (first 10):', seq[0: 10])
        print()
        print('target:', target)

    batch_size = 64
    buffer_size = n_notes - seq_length  # the number of items in the dataset
    train_ds = (seq_ds
                .shuffle(buffer_size)
                .batch(batch_size, drop_remainder=True)
                .cache()
                .prefetch(tf.data.experimental.AUTOTUNE))

    train_ds.element_spec













# to stop the midi music 
if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        pygame.mixer.music.fadeout(1000)
        pygame.mixer.music.stop()
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)

