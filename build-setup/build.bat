@echo off
echo Prepare BUILD for DICE Application 
echo.
echo Building Miner application

call nexe -i ./Apps/Miner/index.js -t win32-x64 -o ./BUILD/Miner_Build/Win/Miner.exe
call nexe -i ./Apps/Miner/index.js -t win32-x86 -o ./BUILD/Miner_Build/Win/Miner_x86.exe

call nexe -i ./Apps/Miner/index.js -t macos-x64 -o ./BUILD/Miner_Build/Mac/Miner
call nexe -i ./Apps/Miner/index.js -t macos -o ./BUILD/Miner_Build/Mac/Miner_x86

call nexe -i ./Apps/Miner/index.js -t linux-x64 -o ./BUILD/Miner_Build/Linux/Miner
call nexe -i ./Apps/Miner/index.js -t linux-x32 -o ./BUILD/Miner_Build/Linux/Miner_x86

echo Everything finished
pause