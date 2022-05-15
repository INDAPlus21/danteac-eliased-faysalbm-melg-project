# How to train the AI with the training data.

1. Download `train-data.zip` in this directory and extract it so that you end up with a folder called `train-data`. This folder contains all MIDI files from the v3.0.0 MAESTRO dataset, in one single folder (See note).
2. Then, move the folder `train-data` (that you extracted) into `./aiproject`. This path (i.e. `aiproject/train-data/`) is currently in the `.gitignore` file and will therefore not be pushed into the remote repo.
3. Then run `main.rs`, whilst being in the `./aiproject` directory (i.e. having it as the working directory).
4. Congratulations, you are now training the AI with the MAESTRO dataset.

#### Note

The original `.zip` of the v3.0.0. MAESTRO dataset is also in this folder, if you wish to download it and for example see what is in `train-data.zip` in a more structured manner.