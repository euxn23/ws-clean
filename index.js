#! /usr/bin/env node

const fs = require('fs').promises

const { WORKSPACE_DIR, QUIET } = process.env

const workspaceDirList = (WORKSPACE_DIR || 'packages').split(',')


if (!QUIET) {
  console.log('removing node_modules ...')
}

Promise.all([
  fs.rmdir('node_modules', { recursive: true }),
  ...workspaceDirList.map(async (workspaceDir) => {
    const packageDirList = await fs.readdir(workspaceDir)
    return packageDirList.map((packageDir) => {
      const target = `${workspaceDir}/${packageDir}/node_modules`
      if (!QUIET) {
        console.log(`removing ${target} ...`)
      }
      return fs.rmdir(target, { recursive: true })
    })
  })
]).then(() => {
  console.log(`Removing node_modules in ${workspaceDirList.join(', ')} is finished`)
})

