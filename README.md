![DICE.Money](https://dice.money/assets/img/logo.png)

# DICE Money Cli  

[![CodeFactor](https://www.codefactor.io/repository/github/dice-money/dice-cli-core/badge)](https://www.codefactor.io/repository/github/dice-money/dice-cli-core)

The Social Mining Protocol
DICE is a cryptocurrency, the basis of a revolutionary new model of social economy. 
[DICE.Money](https://dice.money)
 
The current project is a NodeJS Application.     

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them
 
1. You will need to have installed NodeJS Engine on your computer.
2. Also it's required to have npm packege managment system locally.
3. [optional]  MinGW for Windows machines.
4. [optional]  Nexe package installed as global package.
5. [optional]  Mocha and mochawesome packages installed as global packages. 


Go to [NodeJS](https://nodejs.org) and download NodeJS Engine.
Recomended version: 8.9.x (LTS)

Install NodeJS 
 
[optional] Only for building of project  
Go to [MinGW](http://mingw.org) and download installer.

Install basic setup of GNU packages.
 

### Installing

As regular NodeJS application, you will need to install all required packages.
 
Clone repository or download zip
```
git clone --recurse-submodules https://github.com/DICE-Money/DICE-Cli-Core.git
```
or
```
git clone https://github.com/DICE-Money/DICE-Cli-Core.git
cd ~/DICE-Cli-Core
git clone https://github.com/DICE-Money/DICE-Cli-Miner.git Apps/Miner
git clone https://github.com/pollarize/elliptic.git 3rd-modified/elliptic
```

Install application
```
cd ~/DICE-Cli-Core 
npm install  
```
or 
```
Install.bat
```

[optional] Install global packages 
```
npm -i -g nexe
npm -i -g mocha
npm -i -g mochawesome  
```
To verify installation go to Miner folder
```
cd ~/DICE-Cli-Core/Apps/Miner
node index.js -ver
```

## Authors

* **Mihail Maldzhanski** - *Initial work* - [pollarize](https://github.com/pollarize)

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details


