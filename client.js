var mapping = new Map();
var ws;

class RemoteClient {
    constructor(uri, context) {
        this.context = context;
        this.uri = uri;
        this.context.connecting();
        this.connect();
    }

    join(party, handler) {
        this.send("join", handler, party);
    }

    message(party, handler, msg) {
        console.log("party: " + party);
        this.send("chat", handler, party, msg);
    }

    namechange(name, handler, party) {
        this.send(
            "name",
            handler,
            party === undefined ? "undefinded" : party,
            name
        );
    }

    send(command, handler, ...args) {
        let uuid = this.uuidv4();
        let json = {
            command: command,
            uuid: uuid,
            args: args.join(" "),
        };
        let message = JSON.stringify(json);
        console.log("[ws-out] " + message);
        mapping.set(uuid, handler);
        this.ws.send(message);
    }

    uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
            (
                c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
            ).toString(16)
        );
    }

    connect() {
        this.ws = new WebSocket(this.uri);
        let uri = this.uri;
        this.ws.onopen = (e) => {
            console.log("connected to " + uri);
            this.context.ready();
        };

        this.ws.onmessage = (e) => {
            try {
                console.log("[ws-in] " + e.data);
                var json = JSON.parse(e.data);
                if (json.hasOwnProperty("uuid")) {
                    let uuid = json["uuid"];
                    let handler = mapping.get(uuid);
                    console.log("[ws-debug] forward to handler");
                    handler(json);
                    mapping.delete(uuid);
                } else {
                    this.context.incoming(json);
                }
            } catch (error) {
                console.log(error);
            }
        };

        this.ws.onclose = (e) => {
            console.log("disconnected from " + uri);
            this.context.disconnect();
            setTimeout(() => {
                this.context.reconnect();
                this.connect();
            }, 1000);
        };

        this.ws.onerror = (err) => {
            console.error("error: ", err.message, "closing socket");
            this.ws.close();
        };
    }
}
