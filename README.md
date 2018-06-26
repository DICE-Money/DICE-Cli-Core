# DICE Money Cli  

The Social Mining Protocol
DICE is a cryptocurrency, the basis of a revolutionary new model of social economy. https://dice.money 
 
The current project is a NodeJS Application.     

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them
 
1. You will need to have installed NodeJS Engine on your computer.
2. Also it's required to have npm packege managment system locally.

[optional]  
3. MinGW for Windows machines.
4. Nexe package installed as global package.
5. Mocha and mochawesome packages installed as global packages. 

```
Go to https://nodejs.org and download NodeJS Engine.
Recomended version: 8.9.x (LTS)

Install NodeJS 
```

```
[optional] Only for building of project  
Go to http://mingw.org and download installer.

Install basic setup of GNU packages.
```
 

### Installing

As regular NodeJS application, you will need to install all required packages.
 
Clone repository or download zip
```
git clone https://github.com/DICE-Money/DICE-Cli-Core.git
```
 
Install application
```
cd ~/DICE-Cli-Core 
npm install  

or 

Install.bat
```

[optional] Install global packages 
```
npm -i -g nexe
npm -i -g mocha
npm -i -g mochawesome
```

To verify installation go to ~/DICE-Cli-Core/Apps/Miner and run node index.js -ver

## Authors

* **Mihail Maldzhanski** - *Initial work* - [pollarize](https://github.com/pollarize)

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details


