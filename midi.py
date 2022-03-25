import pygame
import signal
import sys
import os

# pick a midi music file you have ...
# (if not in working folder use full path)
def play_music(music_file):
    freq = 44100    # audio CD quality
    bitsize = -16   # unsigned 16 bit
    channels = 2    # 1 is mono, 2 is stereo
    buffer = 1024    # number of samples
    pygame.mixer.init(freq, bitsize, channels, buffer)
    
    # optional volume 0 to 1.0
    pygame.mixer.music.set_volume(0.8)

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

# put all the function calls in main 
def main(): 
    play_music("./bohemian.mid")

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

"""import os

from mido import MidiFile

cv1 = MidiFile('new_song.mid', clip=True)
cv3 = MidiFile('VampireKillerCV3.mid', clip=True)

del cv1.tracks[4]
del cv1.tracks[4]

cv1.tracks.append(cv3.tracks[4])
cv1.tracks.append(cv3.tracks[5])

cv1.save('mashup.mid')"""
