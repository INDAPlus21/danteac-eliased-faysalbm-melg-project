"""import mido
msg = mido.Message('note_on', note=60)
print(msg.type, msg.note, msg.bytes()) 
msg.copy(channel=2)"""
""" port = mido.open_output('Port Name')
port.send(msg)
with mido.open_input() as inport:
    for msg in inport:
        print(msg)
mid = mido.MidiFile('song.mid')
for msg in mid.play():
    port.send(msg) """

"""# https://stackoverflow.com/questions/6030087/play-midi-files-in-python

from midi2audio import FluidSynth

#Play MIDI

FluidSynth().play_midi('./bohemian.mid')

#Synthesize MIDI to audio

# Note: the default sound font is in 44100 Hz sample rate

fs = FluidSynth()
fs.midi_to_audio('input.mid', 'output.wav')

# FLAC, a lossless codec, is recommended

fs.midi_to_audio('input.mid', 'output.flac')"""

import pygame

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
# pick a midi music file you have ...
# (if not in working folder use full path)

midi_file = './bohemian.mid'
freq = 44100    # audio CD quality
bitsize = -16   # unsigned 16 bit
channels = 2    # 1 is mono, 2 is stereo
buffer = 1024    # number of samples
pygame.mixer.init(freq, bitsize, channels, buffer)

# optional volume 0 to 1.0
pygame.mixer.music.set_volume(0.8)
try:
    play_music(midi_file)
except KeyboardInterrupt:
    # if user hits Ctrl/C then exit
    # (works only in console mode)
    pygame.mixer.music.fadeout(1000)
    pygame.mixer.music.stop()
    raise SystemExit