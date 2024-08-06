const CryptoJS = require('crypto-js');
const axios = require("axios");


appid = "__UNI__B830AC1"
olaSignKey = "ola100-ola101.ola102_ola103"
Version = "2.61.0"
VersionCode = 26100
channel = "yingykngbao-tf"
const uuidv4 = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
deviceid = [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).toUpperCase().padStart(2, '0')).join('');
uuid = uuidv4()

brand = "samsung"
model = "SM-G9600"
osVersion = "10"
osAndroidAPILevel = 29
ua = "Mozilla/5.0 (Linux; Android 10; SM-G9600 Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.135 Mobile Safari/537.36 uni-app (Immersed/24.0)"

apiurl = "https://app.ola100.com"

safeArea = {
    left: 0,
    right: 725,
    top: 24,
    bottom: 360,
    width: 725,
    height: 336
}
safeAreaInsets = {
    top: 24,
    right: 0,
    bottom: 0,
    left: 0
}

function encrypt(str, key) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var ivHex = keyHex.clone();
    return CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(str),
        keyHex,
        {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    ).toString();
}

function decrypt(encryptedStr, key) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var ivHex = keyHex.clone();
    var decrypted = CryptoJS.AES.decrypt(
        encryptedStr,
        keyHex,
        {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    return decrypted.toString(CryptoJS.enc.Utf8).toString();
}

function md5(str) {
    return CryptoJS.MD5(str).toString();
}

let time

function getTime() {
    time=(new Date).getTime() + ""
    return time
}

function getKey() {
    time = getTime()
    key = (time + appid).substring(0, 16);
    return key
}

// systemInfo https://uniapp.dcloud.net.cn/api/system/info.html#getsysteminfo
systemInfo = {
    SDKVersion: "",
    appId: appid,
    appLanguage: "zh-Hans",
    appName: "欧拉初中数学",
    appVersion: Version,
    appVersionCode: VersionCode,
    appWgtVersion: Version,
    brand: brand,
    browserName: "chrome",
    browserVersion: "126.0.6478.135",
    deviceBrand: brand,
    deviceId: deviceid,
    deviceModel: model,
    // 设备方向
    deviceOrientation: "landscape",
    // 设备像素比
    devicePixelRatio: 3,
    deviceType: "phone",
    errMsg: "getSystemInfoSync:ok",
    language: "zh-CN",
    model: model,
    oaid: "",
    osAndroidAPILevel: osAndroidAPILevel,
    osLanguage: "zh-CN",
    osName: "android",
    osTheme: "light",
    osVersion: osVersion,
    pixelRatio: 3,
    platform: "android",
    romName: "Android",
    romVersion: osVersion,
    safeArea: safeArea,
    safeAreaInsets: safeAreaInsets,
    screenHeight: 360,
    screenWidth: 725,
    statusBarHeight: 24,
    system: "Android " + osVersion,
    ua: ua,
    uniCompileVersion: "3.8.7",
    uniPlatform: "app",
    uniRuntimeVersion: "3.8.7",
    version: "1.9.9.81902",
    windowBottom: 0,
    windowHeight: 360,
    windowTop: 0,
    windowWidth: 725,
    systemInt: 8,
    isLiuhai: false,
    wgtVersionCode: VersionCode
}

deviceInfo = {
    imei: "",
    imsi: "",
    model: model,
    vendor: brand,
    uuid: uuid
}

appInfo = {
    appid: appid,
    arguments: "",
    version: Version,
    innerVersion: "1.9.9.81902",
    uniVersion: "3.8.7",
    launcher: "default",
    origin: "default",
    processId: Math.floor(10000 + Math.random() * 90000),
    startupTime: getTime(),
    versionCode: VersionCode,
    channel: channel
}

// 固定值 plus.push.getClientInfo()
clientInfo = {
    id: "unipush",
    token: "40e0ba1d16024e90aab0f05415e07473",
    clientid: "40e0ba1d16024e90aab0f05415e07473",
    appid: "CcCQvRzxqq8Y6lduUo0ik6",
    appkey: "bBzveDr7Y1ACEiqVVztmW7"
}

function getolaParams(str) {
    let key = getKey()
    return encrypt(str, key)
}

function base64Encode(str) {
    return CryptoJS.enc.Utf8.parse(str).toString(CryptoJS.enc.Base64);
}

function getOlaSign2() {
    // APPINFO等同于 uniapp的 plus.runtime 对象
    sign2 = md5(olaSignKey + appid + time + channel + VersionCode)
    OlaSign2 = base64Encode(time + ":" + channel + ":" + VersionCode + ":" + sign2);
    return OlaSign2
}


async function regedit_device() {

    url = apiurl + '/v3/device/activate';
    data = {
        olaParams: getolaParams(JSON.stringify({
            systemInfo: systemInfo,
            deviceInfo: deviceInfo,
            appInfo: appInfo,
            channel: channel,
            deviceId: deviceid,
            versionCode: VersionCode,
            wgtVersionCode: VersionCode
        }))
    };

    // 构造请求配置
    config = {
        headers: {
            'OlaSign2': getOlaSign2(),
            'User-Agent': ua,
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip'
        },
    };

    // 发送POST请求
    await axios.post(url, data, config)
        .then(response => {
            console.log(response.data); // 打印响应数据
        })
        .catch(error => {
            console.error('Error:', error.response ? error.response.data : error.message);
        });
}


async function getToken() {
    await regedit_device()
    url = apiurl + '/v3/login/visitor';
    data = {
        olaParams: getolaParams(JSON.stringify({
            systemInfo: systemInfo,
            deviceInfo: deviceInfo,
            appInfo: appInfo,
            clientInfo: clientInfo,
            channel: channel,
            deviceId: deviceid,
            versionCode: VersionCode,
            wgtVersionCode: VersionCode
        }))
    };

    // 构造请求配置
    config = {
        headers: {
            'OlaSign2': getOlaSign2(),
            'User-Agent': ua,
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip'
        },
    };

    // 发送POST请求
    axios.post(url, data, config)
        .then(response => {
            console.log(response.data); // 打印响应数据
        })
        .catch(error => {
            console.error('Error:', error.response ? error.response.data : error.message);
        });
}

getToken()
