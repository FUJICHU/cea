import sstore from '@beetcb/sstore'
import fetch from 'node-fetch'
const pushEndpoints = ['http://pushplus.hxtrip.com/send']
const notifications: Array<string> = []

const saveNotifications = (args: Array<any>) => {
  const message = args[0]
  const [log, at] = [message?.message ?? message, message?.suffix ?? '']
  notifications.push(`${log} ${at ?? ''}`)
}

const notify = async function(addtionalMessage: string) {
  const notifyConf = sstore.get('notifier')
  if (!notifyConf?.length) {
    return
  }
  const [pushPlatform, pushToken] = notifyConf 
  const content = `${notifications.join(`<br>`)}<br>${
    addtionalMessage.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp')
  }`
  const url = pushEndpoints[Number(pushPlatform)]
  if (pushToken && url) {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        token: pushToken,
        title: 'Cea.js 消息推送服务',
      }),
    })
  }
}

export { notify, saveNotifications }
