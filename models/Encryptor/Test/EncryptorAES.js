var crypto = require("crypto")

function encrypt(key, data) {
        var cipher = crypto.createCipher('aes-256-cbc', key);
        var crypted = cipher.update(text, 'utf-8', 'hex');
        crypted += cipher.final('hex');

        return crypted;
}

function decrypt(key, data) {
        var decipher = crypto.createDecipher('aes-256-cbc', key);
        var decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
}

var key = "supersecretkey";
var text = "Hello World";

console.log("Original Text: " + text);
var encryptedText = encrypt(key, text);
console.log("Encrypted Text: " + encryptedText);
var decryptedText = decrypt(key, encryptedText);
console.log("Decrypted Text: " + decryptedText);
