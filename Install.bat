@echo off

echo Installing DICE-Money console application development kit
echo.

git clone https://github.com/DICE-Money/DICE-Cli-Miner.git Apps/Miner
git clone https://github.com/pollarize/elliptic.git 3rd-modified/elliptic

npm install

npm -i -g nexe
npm -i -g mocha
npm -i -g mochawesome 

echo.
echo READY
pause