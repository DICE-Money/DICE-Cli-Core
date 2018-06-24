@echo off

echo Obfusticate Applications
call javascript-obfuscator ../Apps --output ../obf --compact true --controlFlowFlattening true --controlFlowFlatteningThreshold 1 --deadCodeInjection true --deadCodeInjectionThreshold 1 --debugProtection true --debugProtectionInterval true --disableConsoleOutput true --identifierNamesGenerator hexadecimal --log false --renameGlobals false --rotateStringArray true --selfDefending true --stringArray true --stringArrayEncoding rc4 --stringArrayThreshold 1 --transformObjectKeys true --unicodeEscapeSequence false

echo Obfusticate Models
call javascript-obfuscator ../models --output ../obf --compact true --controlFlowFlattening true --controlFlowFlatteningThreshold 1 --deadCodeInjection true --deadCodeInjectionThreshold 1 --debugProtection true --debugProtectionInterval true --disableConsoleOutput true --identifierNamesGenerator hexadecimal --log false --renameGlobals false --rotateStringArray true --selfDefending true --stringArray true --stringArrayEncoding rc4 --stringArrayThreshold 1 --transformObjectKeys true --unicodeEscapeSequence false

echo Copy nodeJS modules 
rsync -tr --ignore-errors ../node_modules ../obf/
rsync -tr --ignore-errors ../3rd-modified ../obf/
