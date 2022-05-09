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

""" try:
    play_music("./bohemian.mid")
except KeyboardInterrupt:
    # if user hits Ctrl/C then exit
    # (works only in console mode)
    pygame.mixer.music.fadeout(1000)
    pygame.mixer.music.stop()
    raise SystemExit """