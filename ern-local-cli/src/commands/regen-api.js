// @flow

import {
  ApiGen
} from 'ern-api-gen'
import {
  manifest,
  PackagePath,
  utils as coreUtils
} from 'ern-core'
import utils from '../lib/utils'

exports.command = 'regen-api'
exports.desc = 'Regenerates an existing api'

exports.builder = function (yargs: any) {
  return yargs
    .option('skipVersion', {
      alias: 's',
      describe: 'Do not update API version and do not publish'
    })
    .option('bridgeVersion', {
      alias: 'b',
      describe: 'Bridge version to use'
    })
    .epilog(utils.epilog(exports))
}

exports.handler = async function ({
  skipVersion,
  bridgeVersion
} : {
  skipVersion: boolean,
  bridgeVersion: string
} = {}) {
  try {
    if (!bridgeVersion) {
      const bridgeDep = await manifest.getNativeDependency(PackagePath.fromString('react-native-electrode-bridge'))
      if (!bridgeDep) {
        throw new Error('react-native-electrode-bridge not found in manifest. please provide explicit version')
      }
      if (!bridgeDep.version) {
        throw new Error('react-native-electrode-bridge version not defined. This should not happen')
      }
      bridgeVersion = bridgeDep.version
    }

    await ApiGen.regenerateCode({bridgeVersion, skipVersion})
  } catch (e) {
    coreUtils.logErrorAndExitProcess(e)
  }
}
