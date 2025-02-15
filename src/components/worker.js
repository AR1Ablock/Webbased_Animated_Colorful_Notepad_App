import pako from 'pako';

// worker.js
try {
  self.onmessage = function (e) {
    try {
    const {compressedNote } = e.data;

    console.log("worker received note--> ", compressedNote);

    
      // Decompress and parse the file
      const decompressed = pako.inflate(compressedNote, { to: 'string' });

      console.log("worker decompressed note--> ", decompressed);
      
      const decompressednote = JSON.parse(decompressed);

      console.log("worker decompressed parsed note--> ", decompressednote);

      // Send the note back to the main thread
      self.postMessage({note : decompressednote});
    } catch (error) {
      console.log(error);
      self.postMessage({error : error});
    }
  };

} catch (error) {
  console.log(error.message);
}
