#! /usr/bin/env node

'use strict'

var Hapi = require('hapi')
var xtend = require('xtend')
var minimist = require('minimist')

var assetManager = require('@marcoleo/asset-manager')('corsonode','asset')

var defaults = {
  port: 8989
}

function assetsService (opts) {
  opts = xtend(defaults, opts)

  var server = new Hapi.Server()

  server.connection({ port: opts.port })

  function hello (request, reply) {
    reply('Hello World')
  }

  function get (request, reply) {

    var name = request.params.name;

    if (name == "" || name == null || name == undefined)
      assetManager.get({},function (err,docs){

        if(!err)
          reply(docs)
        else
          reply(err)

      })
    else
      assetManager.get({name : name },function (err,docs){

        if(!err)
          reply(docs[0])
        else
          reply(err)

      })


  }

  function put (request, reply) {
    assetManager.put(request.payload,function(err,docs){
      if(!err)
          reply(docs)
        else
          reply(err)
    })
  }

  server.route({ method: 'GET', path: '/', handler: hello })

  server.route({
    method: 'GET',
    path: '/assets',
    handler: get
  })

  server.route({
    method: 'GET',
    path: '/assets/{name}',
    handler: get
  })

  server.route({
    method: 'POST',
    path: '/assets',
    handler: put,
    config: {
        validate: {
            payload: assetManager.JoiSchema()
        }
    }
  })

  return server
}

function start (opts) {
  var server = assetsService(opts)
  server.start(function (err) {
    if (err) { throw err }

    server.connections.forEach(function (conn) {
      console.log('server started on port', conn.settings.port)
    })
  })
}

module.exports = assetsService

if (require.main === module) {
  start(minimist(process.argv.slice(2), {
    integer: 'port',
    alias: {
      'port': 'p'
    }
  }))
}
