import { LibreDwg } from "../assets/libredwg-web.js";

let libredwg: any = null;
let ready = false;

async function init() {
  if (!ready) {
    libredwg = await LibreDwg.create();
    ready = true;
  }
}

self.onmessage = async (e) => {
  try {
    await init();
    const { buffer } = e.data as { buffer: ArrayBuffer };

    const uint8 = new Uint8Array(buffer);
    const fileName = "tmp.dwg";
    const svgName = "out.svg";

    // Write DWG
    libredwg.FS.writeFile(fileName, uint8);
    
    // Read DWG
    const result = libredwg.dwg_read_file(fileName);
    
    if (result.error != 0) {
    //   self.postMessage({ error: result.error });
    //   return;
    }
    libredwg.FS.unlink(fileName);

    // Convert
    const db = libredwg.convert(result.data);
    const svgText = libredwg.dwg_to_svg(db);
    // ⚠️ IMPORTANT: free references
    result.data = null;

    libredwg.FS.writeFile(svgName, svgText);

    const svgBytes = libredwg.FS.readFile(svgName);

    libredwg.FS.unlink(svgName);
    
    self.postMessage(
      { svgBytes },
      [svgBytes.buffer] // 🚀 Transfer ownership
    );
  } catch (err) {
    self.postMessage({ error: String(err) });
  }
};
