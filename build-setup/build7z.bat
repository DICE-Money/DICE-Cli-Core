@echo off
ls -I dist -I BUILD -I obf -I "*.7z" | tr '\n' ' ' > sources.txt
set /p sourcesFolder=<sources.txt
del sources.txt

set deliveryFolder="./dist/*"
set zip="C:\Program Files\7-Zip\7z.exe"

set /p version="Delivery verion select(example: 1.00) "
set /p label="Delivery main changes/label(example: Scrapping) "
echo %label% | tr ' ' '_' > buf.txt
set /p modLabel=<buf.txt
del buf.txt

echo ##############################
echo # ARCHIVING DELIVERY VERSION #
echo ##############################
%zip% a -t7z -r Delivery_%version%.7z %deliveryFolder%

echo ##############################
echo #      ARCHIVING SOURCES     #
echo ##############################
%zip% a -t7z -r EncryptionNodeJS_%version%_%modLabel%.7z %sourcesFolder%

pause