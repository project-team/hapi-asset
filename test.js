'use strict'

var code = require('code')
var Lab = require('lab')
var lab = exports.lab = Lab.script({ output: process.stdout })
var assetsService = require('./')

lab.experiment('AssetPut', function () {
  lab.test('Testing for Put Asset', function (done) {
    var server = assetsService({ port: 8989 })
    var options = { method: 'POST', url: '/assets',  payload : {name :'testfinale',status : 'aa', id: '55952f0afb7226f7225a110d' }  }
    server.inject(options, function (response) {
      var result = response.result

      console.log(result)

      done()
    })
  })
})
