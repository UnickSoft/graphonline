;
async function compress_text_into_zip_base64(str, callback, mode = "gzip")
{
  try 
  {
    const blobToBase64 = blob => new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    });
    const byteArray = new TextEncoder().encode(str);
    const cs = new CompressionStream(mode);
    const writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    return await new Response(cs.readable).blob().then(blobToBase64)
      .then(
        res => callback(res)
      );
  }
  catch (err)
  {
    console.error(err)
  }
  return "";
}

async function decompress_base64_zip_into_text(str, callback, mode = "gzip")
{
  try 
  {
    const bytes = Uint8Array.from(atob(str), c => c.charCodeAt(0));
    const cs = new DecompressionStream(mode)
    const writer = cs.writable.getWriter()
    writer.write(bytes)
    writer.close()
    return await new Response(cs.readable).arrayBuffer()
      .then(
        arr => callback(new TextDecoder().decode(arr)),
        async _=>{throw new Error(await Promise.reject(await writer.closed))}
      );
  }
  catch (err)
  {
    console.error(err)
  }
  return "";
}
