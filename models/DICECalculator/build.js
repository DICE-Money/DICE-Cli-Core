const nexe = require('nexe')
nexe.compile({
  output: 'dicecalculator',
  silent: true,
  native: {
    sha3: {
      additionalFiles: [
        '../../models/SHA-3_C/build/Release/sha3_C_Addon.node'
      ]
    }
  }
})