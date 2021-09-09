import Fibos from 'fibos.js'

export const loginIronman = (sucCb, noIronman, config) => {
  if (!window.ironman) {
    if (!!noIronman) {
      noIronman()
    } else {
      window.open('https://wallet.fo/')
    }
  } else {
    const ironman = window.ironman
    const hostname = new URL(config.client.hostname).hostname
    const blockchain = config.client.blockchain

    // 防止别的网页应用 调用window.ironman 对象
    // window.ironman = null;
    // If you want to require a specific version of Scatter
    const foNetwork = {
      blockchain: blockchain,
      chainId: config.client.chainId,
      host: hostname,
      port: config.client.port,
      protocol: config.client.protocol,
    }

    const RequirefoNetwork = {
      blockchain: blockchain,
      chainId: config.client.chainId,
    }

    // 给用户推荐网络， 第一次需要授权
    // ironman.suggestNetwork(foNetwork);
    // ironman.getIdentity 用户授权页面
    ironman
      .getIdentity({
        accounts: [RequirefoNetwork],
      })
      .then(identity => {
        const account = identity.accounts.find(acc => acc.blockchain === blockchain)
        const { name, authority } = account
        // FO参数
        const foOptions = {
          authorization: [`${name}@${authority}`],
          broadcast: true,
          chainId: config.client.chainId,
        }
        // 获取FO instance
        // const fo = ironman.fibos(() =>{
        //     return foNetwork, Fibos, foOptions, "http"
        // })

        const fo = ironman[blockchain](foNetwork, Fibos, foOptions, config.client.protocol)
        const requiredFields = {
          accounts: [foNetwork],
        }

        if (sucCb) {
          sucCb(ironman, fo, requiredFields, account, foNetwork, identity)
        }
      })
      .catch(e => {
        // TODO
      })
  }
}

export function logoutIronman(sucCb) {
  const ironman = window.ironman
  if (sucCb) {
    sucCb()
  }
  if (ironman) {
    try {
      ironman
        .forgetIdentity()
        .then(value => {
          window.location.reload()
        })
        .catch(e => {
          window.location.reload()
        })
    } catch {
      window.location.reload()
    }
  } else {
    window.location.reload()
  }
}

export function loadIronman(sucCb, config) {
  if (!window.ironman) {
    window.open('https://wallet.fo/')
  } else {
    const hostname = new URL(config.client.hostname).hostname
    const ironman = window.ironman
    const blockchain = config.client.blockchain
    // 防止别的网页应用 调用window.ironman 对象
    // window.ironman = null;
    // If you want to require a specific version of Scatter
    const foNetwork = {
      blockchain: blockchain,
      chainId: config.client.chainId,
      host: hostname,
      port: config.client.port,
      protocol: config.client.protocol,
    }

    const RequirefoNetwork = {
      blockchain: blockchain,
      chainId: config.client.chainId,
    }

    // 给用户推荐网络， 第一次需要授权
    // ironman.suggestNetwork(foNetwork);
    // ironman.getIdentity 用户授权页面
    ironman
      .getIdentity({
        accounts: [RequirefoNetwork],
      })
      .then(identity => {
        const account = identity.accounts.find(acc => acc.blockchain === blockchain)
        const { name, authority } = account
        // FO参数
        const foOptions = {
          authorization: [`${name}@${authority}`],
          broadcast: true,
          chainId: config.client.chainId,
        }

        // 获取FO instance
        const fo = ironman[blockchain](foNetwork, Fibos, foOptions, config.client.protocol)
        const requiredFields = {
          accounts: [foNetwork],
        }

        if (sucCb) {
          sucCb(ironman, fo, requiredFields, account, foNetwork, identity)
        }
      })
      .catch(e => {
        // TODO
      })
  }
}
