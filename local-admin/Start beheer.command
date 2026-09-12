#!/bin/zsh
set -eu
cd -- "${0:A:h}"
exec python3 server.py serve --port 8878 --open
