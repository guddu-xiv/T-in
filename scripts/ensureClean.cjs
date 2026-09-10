const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// 1. Ensure studentTemplate.ts integrity
try {
  const studentFile = path.join(process.cwd(), "src", "utils", "studentTemplate.ts");
  if (fs.existsSync(studentFile)) {
    const sBuf = fs.readFileSync(studentFile);
    let sOffset = -1;
    for (let i = 0; i < sBuf.length - 2; i++) {
      if (
        sBuf[i] === 0x78 &&
        (sBuf[i + 1] === 0x9c || sBuf[i + 1] === 0xda || sBuf[i + 1] === 0x01 || sBuf[i + 1] === 0x5e)
      ) {
        try {
          zlib.inflateSync(sBuf.slice(i), { finishFlush: zlib.constants.Z_SYNC_FLUSH });
          sOffset = i;
          break;
        } catch {}
      }
    }
    if (sOffset !== -1) {
      const part1 = sBuf.slice(0, sOffset).toString("utf8");
      const part2 = zlib.inflateSync(sBuf.slice(sOffset)).toString("utf8");
      fs.writeFileSync(studentFile, part1 + part2, "utf8");
      console.log("[Integrity] Decompressed and restored studentTemplate.ts");
    }
  }
} catch (err) {
  console.error("[Integrity] Error checking studentTemplate.ts:", err.message);
}

// 2. Ensure db.json integrity
try {
  const dbFile = path.join(process.cwd(), "data", "db.json");
  if (fs.existsSync(dbFile)) {
    const dBuf = fs.readFileSync(dbFile);
    try {
      JSON.parse(dBuf.toString("utf8"));
    } catch (parseErr) {
      const offsets = [];
      for (let i = 0; i < dBuf.length - 2; i++) {
        if (
          dBuf[i] === 0x78 &&
          (dBuf[i + 1] === 0x9c || dBuf[i + 1] === 0xda || dBuf[i + 1] === 0x01 || dBuf[i + 1] === 0x5e)
        ) {
          try {
            zlib.inflateSync(dBuf.slice(i), { finishFlush: zlib.constants.Z_SYNC_FLUSH });
            offsets.push(i);
          } catch {}
        }
      }
      if (offsets.length > 0) {
        let reconstructed = dBuf.slice(0, offsets[0]).toString("utf-8");
        for (let idx = 0; idx < offsets.length; idx++) {
          const start = offsets[idx];
          const end = idx + 1 < offsets.length ? offsets[idx + 1] : dBuf.length;
          const chunk = dBuf.slice(start, end);
          const dec = zlib.inflateSync(chunk);
          reconstructed += dec.toString("utf-8");
        }
        const parsed = JSON.parse(reconstructed);
        fs.writeFileSync(dbFile, JSON.stringify(parsed, null, 2), "utf8");
        console.log("[Integrity] Decompressed and restored db.json");
      }
    }
  }
} catch (err) {
  console.error("[Integrity] Error checking db.json:", err.message);
}
