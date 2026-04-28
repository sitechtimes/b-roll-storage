# B-roll storage system

## Description

System for storing b-roll images and video in an easily accessible manner 
Uses Express for backend, MongoDB for storage, RAM+ for tagging media

## How to start the backend (funky AI stuff)

```bash
git clone https://github.com/sitechtimes/b-roll-storage
cd b-roll-storage
npm i
git clone https://github.com/xinyu1205/recognize-anything
python -m venv .venv
```

if on windows (I think):
```.\.venv\Scripts\pip.exe install -r recognize-anything/requirements.txt``` 
or if on linux:
```./.venv/bin/pip install -r recognize-anything/requirements.txt```

To actually start it, `npm run start` (don't forget the .env)


Now there are two weird errors that will occur from here when you attempt to get the AI tagging model to run:

The first of which is `ImportError: cannot import name 'apply_chunking_to_forward' from 'transformers.modeling_utils'`
to which you need to edit `/recognise-everything/ram/models/bert.py` and change
```
from transformers.modeling_utils import (
    PreTrainedModel,
    apply_chunking_to_forward,
    find_pruneable_heads_and_indices,
    prune_linear_layer,
)
```
to 
```
from transformers.modeling_utils import (
    PreTrainedModel,
)

from transformers.pytorch_utils import (
    apply_chunking_to_forward,
    find_pruneable_heads_and_indices,
    prune_linear_layer,
)
```

The second error is `ImportError: cannot import name 'find_pruneable_heads_and_indices' from 'transformers.pytorch_utils'` to which you need to run 
```.venv/bin/pip install "transformers==4.57.1"``` (this happens because it installs the incorrect version from the requirements.txt, so you can change that instead).
