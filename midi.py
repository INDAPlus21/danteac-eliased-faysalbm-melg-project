import pygame
import signal
import sys
import os
from mido import MidiFile
import time

# https://www.twilio.com/blog/working-with-midi-data-in-python-using-mido

# pick a midi music file you have ...
# (if not in working folder use full path)
# it's a blocking call (remember that!)
def play_midi(midi_file):
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
    # play_midi("./VampireKillerCV3.mid")
    """ cv1 = MidiFile('new_song.mid', clip=True)
    cv3 = MidiFile('VampireKillerCV3.mid', clip=True)

    del cv1.tracks[4]
    del cv1.tracks[4]

    cv1.tracks.append(cv3.tracks[4])
    cv1.tracks.append(cv3.tracks[5])

    cv1.save('mashup.mid') """
    """ mid = MidiFile('VampireKillerCV1.mid', clip=True)
    print(mid)
    for track in mid.tracks:
        print(track)

    for msg in mid.tracks[0]:
        print(msg) """

    """ cv1 = MidiFile('VampireKillerCV1.mid', clip=True)

    # play_midi("./VampireKillerCV3.mid")

    message_numbers = []
    duplicates = []

    for track in cv1.tracks:
        print(track)
        if len(track) in message_numbers:
            duplicates.append(track)
        else:
            message_numbers.append(len(track))

    for track in duplicates:
        cv1.tracks.remove(track)

    cv1.save('new_song.mid')

    play_midi("new_song.mid") """
    # cv1 = MidiFile('new_song.mid', clip=True)
    cv1 = MidiFile('bohemian.mid', clip=True)
    cv3 = MidiFile('VampireKillerCV3.mid', clip=True)

    del cv1.tracks[4]
    del cv1.tracks[4]

    cv1.tracks.append(cv3.tracks[4])
    cv1.tracks.append(cv3.tracks[5])

    cv1.save('mashup.mid')

    play_midi("mashup.mid")
    # play_midi("VampireKillerCV3.mid")
    # play_midi("VampireKillerCV1.mid")


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

