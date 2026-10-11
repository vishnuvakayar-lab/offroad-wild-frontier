// Protocol-level headless client (Node + ws) used for load tests: sends real inputs at 60 Hz in 2-input batches.
import WebSocket from 'ws';
export function botClient(url, { name = 'LoadBot', mode = 'convoy', code = null, create = null, seed = 1, drive = true, token = null } = {}) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url); const st = { ws, id: 0, token: null, room: null, snaps: 0, bytes: 0, lastSnap: null, errs: [], seq: 0, events: [], closed: null };
    let timer = null;
    ws.on('open', () => ws.send(JSON.stringify({ t: 'hello', proto: 1, name, vehicle: 'scout', paint: 0xd9822b, token })));
    ws.on('message', (d, bin) => {
      if (bin) { st.snaps++; st.bytes += d.length; st.lastSnap = d; return; }
      const m = JSON.parse(d.toString());
      if (m.t === 'ready') ws.send(JSON.stringify(code ? { t: 'join', code } : create ? { t: 'create', mode: create } : { t: 'quick', mode }));
      else if (m.t === 'joined') {
        st.id = m.id; st.token = m.token; st.room = m.room; st.resumed = m.resumed; resolve(st);
        if (drive) { let k = 0; timer = setInterval(() => { const a = []; for (let j = 0; j < 2; j++) { k++; a.push([0.6, 0, Math.sin(k / 90 + seed) * 0.6, 0]); } st.seq += 2; if (ws.readyState === 1) ws.send(JSON.stringify({ t: 'i', s: st.seq - 1, a })); }, 1000 / 30); }
      } else if (m.t === 'room') st.room = m.room;
      else if (m.t === 'err') { st.errs.push(m); if (!st.id) resolve(st); }
      else if (m.t === 'evt') st.events.push(m.msg);
    });
    ws.on('close', (c, r) => { st.closed = { code: c, reason: r.toString() }; clearInterval(timer); if (!st.id) resolve(st); });
    ws.on('error', (e) => { st.errs.push({ code: 'socket', msg: e.message }); if (!st.id) resolve(st); });
    st.stop = () => { clearInterval(timer); ws.close(); };
  });
}
