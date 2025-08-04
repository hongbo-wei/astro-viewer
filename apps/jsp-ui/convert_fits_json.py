import os
import json
from mocpy import MOC

fits_dir = 'public/moc'
json_dir = 'public/moc_json'
os.makedirs(json_dir, exist_ok=True)

for filename in os.listdir(fits_dir):
    if filename.lower().endswith('.fits'):
        fits_path = os.path.join(fits_dir, filename)
        json_filename = os.path.splitext(filename)[0] + '.json'
        json_path = os.path.join(json_dir, json_filename)
        print(f'Converting {fits_path} -> {json_path}')
        moc = MOC.from_fits(fits_path)
        moc_dict = moc.serialize(format='json')
        output = [
        {"order": int(order), "cells": cells}
        for order, cells in sorted(moc_dict.items(), key=lambda x: int(x[0]))
        ]
        with open(json_path, 'w') as f:
            json.dump(output, f)
