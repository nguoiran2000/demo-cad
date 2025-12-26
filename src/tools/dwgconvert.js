import { createModule } from "@mlightcad/libredwg-web/wasm/libredwg-web.js";

export async function convertDwg(fileName) {
    // Create libredwg module instance
    const libredwg = await createModule();

    // Write DWG file content to a temporary file and read it
    const fileName = 'tmp.dwg';
    libredwg.FS.writeFile(
    fileName,
    new Uint8Array(fileContent)
    );
    const result = libredwg.dwg_read_file(fileName);
    if (result.error != 0) {
    console.log('Failed to read DWG file, error code: ', result.error);
    }
    libredwg.FS.unlink(fileName);
    // Get Dwg_Data pointer
    const data = result.data;
}