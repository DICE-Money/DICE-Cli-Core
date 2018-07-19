# Define required macros here
SHELL = /bin/sh

BUILD_FOLDER=BUILD
MI_FOLDER=Miner_Build
OP_FOLDER=Operator_Build
DIST_FOLDER=dist

#Obfustication configuration
OBF_CONFIG="--compact true --controlFlowFlattening true --controlFlowFlatteningThreshold 1 --deadCodeInjection true --deadCodeInjectionThreshold 1 --debugProtection true --debugProtectionInterval true --disableConsoleOutput true --identifierNamesGenerator hexadecimal --log false --renameGlobals false --rotateStringArray true --selfDefending true --stringArray true --stringArrayEncoding rc4 --stringArrayThreshold 1 --transformObjectKeys true --unicodeEscapeSequence false"

#Build config
NODE_VERSION=8.9.0
APPS_FOLDER=Apps_obf
TARGET=all

#Remote build
DEST_FOLDER="/home/espdev/"

ARM32="root@192.168.1.90"
ARM32PORT="22"

ARM64="root@192.168.1.219"
ARM64PORT="25"


#Test command
TEST_ARGS=-ver
OS=Win
BIT=x64

#General build section
folders:
	mkdir -p BUILD
	mkdir -p ./$(BUILD_FOLDER)/$(MI_FOLDER)
	mkdir -p ./$(BUILD_FOLDER)/$(OP_FOLDER)
	
	#Miner subfolders
	mkdir -p ./$(BUILD_FOLDER)/$(MI_FOLDER)/Linux
	mkdir -p ./$(BUILD_FOLDER)/$(MI_FOLDER)/Win
	mkdir -p ./$(BUILD_FOLDER)/$(MI_FOLDER)/Mac
	mkdir -p ./$(BUILD_FOLDER)/$(MI_FOLDER)/Linux_arm
	
	#Operator subfolders
	mkdir -p ./$(BUILD_FOLDER)/$(OP_FOLDER)/Linux
	mkdir -p ./$(BUILD_FOLDER)/$(OP_FOLDER)/Win
	mkdir -p ./$(BUILD_FOLDER)/$(OP_FOLDER)/Mac
	mkdir -p ./$(BUILD_FOLDER)/$(OP_FOLDER)/Linux_arm
	
	#Create distibution folder
	mkdir -p ${DIST_FOLDER}

obfusticate:
	#Obfusticate sources
	javascript-obfuscator ./Apps --output ./obf $(OBF_CONFIG)
	javascript-obfuscator ./models --output ./obf $(OBF_CONFIG)
	javascript-obfuscator ./view --output ./obf $(OBF_CONFIG)
	
	#Create folder
	mkdir -p ./org
	
	#Original folders
	cp -fR ./models ./org
	rm -rf ./models	
	cp -fR ./view ./org
	rm -rf ./view
	
	#Move obfusticated applications
	mv -f ./obf/Apps/ ./$(APPS_FOLDER)
	mv -f ./obf/models/ ./
	mv -f ./obf/view/ ./
	
	#Remove obf folder
	rm -rf obf

#General cleaning section	
build:
ifeq ($(TARGET), all)
	#Windows 
	nexe -i ./$(APPS_FOLDER)/Miner/index.js -t win32-x64-$(NODE_VERSION) -o ./$(BUILD_FOLDER)/$(MI_FOLDER)/Win/Miner.exe
	nexe -i ./$(APPS_FOLDER)/Miner/index.js -t win32-x86-$(NODE_VERSION) -o ./$(BUILD_FOLDER)/$(MI_FOLDER)/Win/Miner_x86.exe

	#MacOS
	nexe -i ./$(APPS_FOLDER)/Miner/index.js -t macos-x64-$(NODE_VERSION) -o ./$(BUILD_FOLDER)/$(MI_FOLDER)/Mac/Miner
	nexe -i ./$(APPS_FOLDER)/Miner/index.js -t macos-$(NODE_VERSION) -o ./$(BUILD_FOLDER)/$(MI_FOLDER)/Mac/Miner_x86

	#Linux
	nexe -i ./$(APPS_FOLDER)/Miner/index.js -t linux-x64-$(NODE_VERSION) -o ./$(BUILD_FOLDER)/$(MI_FOLDER)/Linux/Miner
	nexe -i ./$(APPS_FOLDER)/Miner/index.js -t linux-x32-$(NODE_VERSION) -o ./$(BUILD_FOLDER)/$(MI_FOLDER)/Linux/Miner_x86
endif

ifeq ($(TARGET), armRemote)
	scp -P $(ARM32PORT) -r "./$(APPS_FOLDER)" "./models" "./view" $(ARM32):$(DEST_FOLDER)DICE/EncryptionNodeJS
	ssh -p $(ARM32PORT) $(ARM32) -t -t "su -l; $(DEST_FOLDER)DICE/EncryptionNodeJS/BUILD/Miner_Build/Linux_arm/Miner_x86 -ver"
	scp -P $(ARM32PORT) -r $(ARM32):$(DEST_FOLDER)DICE/EncryptionNodeJS/BUILD ./

	scp -P $(ARM64PORT) -r "./$(APPS_FOLDER)" "./models" "./view" $(ARM64):$(DEST_FOLDER)EncryptionNodeJSSources
	ssh -p $(ARM64PORT) $(ARM64) -t -t "cd $(DEST_FOLDER)/EncryptionNodeJSSources; ./build_x64.sh; npm link ./3rd-modified/elliptic; ./BUILD/Miner_Build/Linux_arm/Miner -ver"
	scp -P $(ARM64PORT) -r $(ARM64):$(DEST_FOLDER)EncryptionNodeJSSources/BUILD ./
	
	ls -l ./$(BUILD_FOLDER)/$(OP_FOLDER)/Linux_arm 
	ls -l ./$(BUILD_FOLDER)/$(MI_FOLDER)/Linux_arm	
endif

ifeq ($(TARGET), arm)
ifeq ($(BIT), x86)
    nexe --build -i ./Apps/Miner/index.js  -o ./BUILD/Miner_Build/Linux_arm/Miner_x86
else
    nexe --build -i ./Apps/Miner/index.js  -o ./BUILD/Miner_Build/Linux_arm/Miner
endif
endif
	
#General cleaning section	
clean:
	rm -rf $(APPS_FOLDER)
	rm -rf ${DIST_FOLDER}
	
	#Move orginal folders
	rm -rf ./models	
	mv ./org/models/ ./
	rm -rf ./view
	mv ./org/view/ ./
		
	rm -rf org

#Test Applications
test:
	
ifeq ($(OS), Win)
ifeq ($(BIT), x86)
	./$(BUILD_FOLDER)/$(MI_FOLDER)/Win/Miner_x86.exe $(TEST_ARGS)
else
	./$(BUILD_FOLDER)/$(MI_FOLDER)/Win/Miner.exe $(TEST_ARGS)
endif
endif
	
ifeq ($(OS), Mac)
ifeq ($(BIT), x86)
	./$(BUILD_FOLDER)/$(MI_FOLDER)/Mac/Miner_x86 $(TEST_ARGS)
else
	./$(BUILD_FOLDER)/$(MI_FOLDER)/Mac/Miner $(TEST_ARGS)

endif
endif
	
ifeq ($(OS), Linux)
ifeq ($(BIT), x86)
	./$(BUILD_FOLDER)/$(MI_FOLDER)/Linux/Miner_x86 $(TEST_ARGS)
else
	./$(BUILD_FOLDER)/$(MI_FOLDER)/Linux/Miner $(TEST_ARGS)
endif
endif

ifeq ($(OS), Linux_arm)
ifeq ($(BIT), x86)
	./$(BUILD_FOLDER)/$(MI_FOLDER)/Linux_arm/Miner_x86 $(TEST_ARGS)
else
	./$(BUILD_FOLDER)/$(MI_FOLDER)/Linux_arm/Miner $(TEST_ARGS)
endif
endif


.PHONY: build clean