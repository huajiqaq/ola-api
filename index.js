const CryptoJS = require('crypto-js');
const axios = require("axios");
const express = require('express');
const os = require('os');
const url = require('url');


function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            const { address, family, internal } = interface;
            if (family === 'IPv4' && !internal) {
                return address;
            }
        }
    }
    return null;
}

const localIp = getLocalIp();
const app = express();


app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    const rawHeaders = req.rawHeaders;
    const headers = {};

    // 将 rawHeaders 数组转换成键值对形式的对象
    for (let i = 0; i < rawHeaders.length; i += 2) {
        const key = rawHeaders[i].toLowerCase();
        if (key !== 'host') { // 如果不是'host'头部，则添加到对象中
            headers[key] = req.rawHeaders[i + 1];
        }
    }

    // 添加一个属性到请求对象中，以保存原始的headers
    req.rawHeadersObject = headers;

    next();
});

// 代理所有请求到目标API
app.all('/api*', async (req, res) => {
    try {
        // 构建完整的目标URL
        let targetUrl = req.path.substring(5); // "/api/"的长度是5

        const params = {
            method: req.method,
            url: targetUrl,
            data: req.body,
            params: req.query,
            headers: req.rawHeadersObject,
        }

        if (targetUrl.includes("micro/findMicro")) {
            const myurl = url.parse(req.url.substring(5), true);
            const time = base64Decode(params.headers.OlaSign2).split(":")[0]
            const key = getKey(time)
            const json = JSON.parse(decrypt(myurl.query.olaParams, key))
            console.log(decrypt(myurl.query.olaParams, key))
            json.deviceId = deviceid
            params.params.olaParams = encrypt(JSON.stringify(json), key)
            token = await getToken()
            console.log(token)
            params.headers.Authorization = token
            params.params.olaParams = getolaParams(JSON.stringify(json))
            params.headers.OlaSign2 = getOlaSign2()
        }

        // 转发请求到目标API
        const response = await axios(params);

        if (targetUrl.includes("user/information")) {
            try {
                response.data.data.memberInfoSubjectInfoList.forEach(element => {
                    element.getIsMember = 1
                });
            } catch (e) {
                console.log("fail", e)
            }
        }

        // 转发响应状态码和数据
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).send('An error occurred while proxying the request.');
    }
});

// 启动服务器
app.listen(3000, () => {
    console.log(`Proxy server listening at  ${localIp}:3000`);
});

apiurl = "https://app.ola100.com"
appid = "__UNI__B830AC1"
olaSignKey = "ola100-ola101.ola102_ola103"
Version = "2.61.0"
VersionCode = 26100
channel = "yingykngbao-tf"

var token = ""
const uuidv4 = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));

var deviceid = [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).toUpperCase().padStart(2, '0')).join('');
var uuid = uuidv4()
var brand = "samsung"
var model = "SM-G9600"
var osVersion = "10"
var osAndroidAPILevel = 29
var ua = "Mozilla/5.0 (Linux; Android 10; SM-G9600 Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.135 Mobile Safari/537.36 uni-app (Immersed/24.0)"


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
    time = (new Date).getTime() + ""
    return time
}

function getKey(timestamp) {
    // timestamp为毫秒的
    if (timestamp == null) {
        timestamp = getTime()
    }
    key = (timestamp + appid).substring(0, 16);
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
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
}

function base64Decode(str) {
    const bytes = CryptoJS.enc.Base64.parse(str);
    const utf8String = CryptoJS.enc.Utf8.stringify(bytes);
    return utf8String.toString();
}

function getOlaSign2(mytoken) {
    if (mytoken == null) {
        mytoken = token
    }
    // APPINFO等同于 uniapp的 plus.runtime 对象
    sign2 = md5(olaSignKey + appid + time + channel + VersionCode + mytoken)
    OlaSign2 = base64Encode(time + ":" + channel + ":" + VersionCode + ":" + sign2);
    return OlaSign2
}


async function regedit_device() {

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
    await axios.post(apiurl + '/v3/device/activate', data, config)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error:', error.response ? error.response.data : error.message);
        });
}


async function getToken() {
    token = ""

    await regedit_device()

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

    try {
        const response = await axios.post(apiurl + '/v3/login/visitor', data, config);
        token = response.data.data.userAuth
        return token
    } catch (error) {
        // 你可以选择抛出错误，或者返回一个错误对象
        throw error.response ? error.response.data : { error: error.message };
    }
}

//getToken()
