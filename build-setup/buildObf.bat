@echo off
echo Copy folders              
cp -r ../Apps ../Apps_obf
cp -r ../models ../models_obf
cp -r ../view ../view_obf   

echo Obfusticate Application
call javascript-obfuscator ../Apps_obf  --compact true --controlFlowFlattening true --controlFlowFlatteningThreshold 1 --deadCodeInjection true --deadCodeInjectionThreshold 1 --debugProtection true --debugProtectionInterval true --disableConsoleOutput true --identifierNamesGenerator hexadecimal --log false --renameGlobals false --rotateStringArray true --selfDefending true --stringArray true --stringArrayEncoding rc4 --stringArrayThreshold 1 --transformObjectKeys true --unicodeEscapeSequence false

echo Obfusticate Models
call javascript-obfuscator ../models_obf --compact true --controlFlowFlattening true --controlFlowFlatteningThreshold 1 --deadCodeInjection true --deadCodeInjectionThreshold 1 --debugProtection true --debugProtectionInterval true --disableConsoleOutput true --identifierNamesGenerator hexadecimal --log false --renameGlobals false --rotateStringArray true --selfDefending true --stringArray true --stringArrayEncoding rc4 --stringArrayThreshold 1 --transformObjectKeys true --unicodeEscapeSequence false
call javascript-obfuscator ../view_obf --compact true --controlFlowFlattening true --controlFlowFlatteningThreshold 1 --deadCodeInjection true --deadCodeInjectionThreshold 1 --debugProtection true --debugProtectionInterval true --disableConsoleOutput true --identifierNamesGenerator hexadecimal --log false --renameGlobals false --rotateStringArray true --selfDefending true --stringArray true --stringArrayEncoding rc4 --stringArrayThreshold 1 --transformObjectKeys true --unicodeEscapeSequence false

mv ../Apps ../Apps_org
mv ../models ../models_org
mv ../view ../view_org

mv ../Apps_obf ../Apps
mv ../models_obf ../models
mv ../view_obf ../view

pause          