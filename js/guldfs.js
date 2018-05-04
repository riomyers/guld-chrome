/* global BrowserFS:false Event:false Blocktree:true */
const config = {
  fs: 'LocalStorage',
  options: {
    '/tmp': {
      fs: 'InMemory'
    }
  }
}
var fs = false
var blocktree = false
var start = Date.now()
BrowserFS.configure(config, err => {
  if (err) throw err
  fs = BrowserFS.BFSRequire('fs')
  blocktree = new Blocktree(fs, 'gg')
  window.dispatchEvent(new Event('blocktree-avail'))
  fs.readdir(`/BLOCKTREE`, (err, list) => {
    if (err) initBT()
    else fs.readdir(`/BLOCKTREE/gg`, (err, list) => {
      if (err) initBT()
      else fs.readdir(`/BLOCKTREE/gg/ledger`, (err, list) => {
        if (err) initBT()
        else fs.readdir(`/BLOCKTREE/gg/ledger/GULD`, (err, list) => {
          if (err) initBT()
          else fs.readdir(`/BLOCKTREE/gg/ledger/GG`, (err, list) => {
            if (err) initBT()
            else fs.readdir(`/BLOCKTREE/gg/keys/pgp`, (err, list) => {
              if (err) return initBT()
              b.blocktree.initialized = true
              b.blocktree.emit('initialized')
            })
          })
        })
      })
    })
  })

})

chrome.runtime.onInstalled.addListener(function() {
  initBT()
})

function initBT () {
  chrome.storage.local.get('gg-initialized', inited => {
    console.log(JSON.stringify(inited))
    if (!inited || !inited.hasOwnProperty('gg-initialized') || inited['gg-initialized'] === false) {
      chrome.storage.local.set({
        'gg-initialized': true
      }, () => {
        console.log(`starting blocktree init @ ${start}`)
        blocktree.initFS('gg', 'guld-games').then(() => {
          console.log(`${(Date.now() - start) / 1000} seconds to init blocktree`)
        })
      })
    } else {
      if (chrome.runtime.lastError) console.error(chrome.runtime.lastError)
    }
  })
}

