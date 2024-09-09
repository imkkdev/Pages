const SDK = {
  // 封装的工具类方法
  app_version: getCookie('app_version'),
  app_key: getCookie('app_key'),
  channelId: getCookie('channelId'),
  channelOrigin: getCookie('channelOrigin'),
  zaLoginCookieKey: getCookie('zaLoginCookieKey'),
  zaMemberLCK: getCookie('zaMemberLCK'),
  zaapp_uuid: getCookie('zaapp_uuid'),
  zaapp_uuid_en: getCookie('zaapp_uuid_en'),
  zadevinfo: getCookie('zadevinfo'),

  // 比较版本大小的方法
  versionCompare(now, latest = SDK.app_version) {
    if (now === latest) {
      return 0;
    } else {
      let arrNow = now.split('.');
      let arrLatest = latest?.split('.') || [];
      let idx = 0;
      while (idx <= 2) {
        if (parseInt(arrNow[idx]) === parseInt(arrLatest[idx])) {
          idx++;
          continue;
        } else if (parseInt(arrNow[idx]) > parseInt(arrLatest[idx])) {
          return 1;
        } else {
          return -1;
        }
      }
    }
  },

  // 工具类方法的实现
  closeWebView() {
    this.SDK('closeWebView', {}, () => { });
  },

  detectIdCard() {
    return new Promise((resolve, reject) => {
      this.SDK('startIDCardDetectInfo', { side: '0' }, (info) => {
        resolve(info.data);
      });
    });
  },

  // 其他方法的实现...

  SDK(event, params, cb) {
    if (!(navigator.userAgent.indexOf('FlutterWebView') > -1 || navigator.userAgent.indexOf('ZhongAnWebView') > -1)) {
      console.warn('non-app environment');
      return;
    }
    const prefix = "ZAJSSDK_";
    const cbName = prefix + event.toUpperCase() + '_CALLBACK';

    const paramsObj = {
      functionName: event,
      params: params,
      complete: cbName
    };

    window[cbName] = function (data) {
      cb && cb(data);
      debug && console.info('Callback callback info huo: ', JSON.parse(data));
      delete window[cbName];
    };

    if (navigator.userAgent.indexOf('FlutterWebView') > -1) {
      window.FlutterWebBridge.postMessage(JSON.stringify(paramsObj));
    } else {
      window.prompt(JSON.stringify(paramsObj));
    }
  },
};

// 将 SDK 绑定到 window 对象上，使其在全局可用
window.SDK = SDK;
