import { createClient } from "@liveblocks/client";
import fetch from "node-fetch";
import WebSocket from "ws";

const main = () => {
    const client = createClient({
        publicApiKey: "pk_dev_Haq_7SFVYWkM4GgsXeHB0a3dgrRUCJuRgB7MpAbOCuGdMv4ovDFDd5Z4UzwgM8Um",
        polyfills: {
            fetch,
            WebSocket,
        },
    });

    const { room } = client.enterRoom("my-room", { initialPresence: {} });

    let count = 0;
    let playersAV = {}
    room.subscribe("others", (others) => {

        others.map(i => {
            const delay = Date.now() - i.presence.timestamp;
            let av = playersAV[i.connectionId] ? (playersAV[i.connectionId] * count + delay) / (count + 1) : 10;
            playersAV[i.connectionId] = av;
        });
    
        count++;
    
        if (count % 100 === 0) { 
            console.log("🚀 ~ updates sample count:", count)
            console.log("🚀 ~ players average latency:", playersAV)
        }
    
    });

    let i = 0;

    function sendPing() {
        room.updatePresence({
            i: i++,
            timestamp: Date.now(),
        });
    }

    // Call sendPing to start the ping-pong process or do it in response to some other event
    setInterval(() => {
        sendPing();
    }, 50);

}

for (let i = 0; i < 10; i++) {
    main();
}