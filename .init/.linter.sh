#!/bin/bash
cd /home/kavia/workspace/code-generation/ludo/FrontendWebApplication
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

