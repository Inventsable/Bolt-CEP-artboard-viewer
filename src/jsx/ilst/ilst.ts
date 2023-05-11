// @ts-nocheck

export const helloWorld = () => {
  alert("Hello from Illustrator");
  app.activeDocument.path;
};

export const exportArtboards = () => {
  const results = [];
  const abs = app.activeDocument.artboards;
  for (let i = 0; i < abs.length; i++) {
    app.activeDocument.artboards.setActiveArtboardIndex(i);
    const destination = new File(
      `${Folder.userData.toString()}/${abs[i].name || `Artboard ${i}`}.png`
    );
    exportArtboardToPNG(destination);
    //
    // We need to pretreat the filepath from a File() object to be POSIX:
    results.push(destination.fsName.replace(/\\/gm, "/"));
  }
  // And we return them to our UI:
  return JSON.stringify(results);
};

export function exportArtboardToPNG(destFile) {
  let exportOptions = new ExportOptionsPNG24();
  exportOptions.artBoardClipping = true;
  exportOptions.transparency = true;
  exportOptions.horizontalScale = 100;
  exportOptions.verticalScale = 100;
  const fileExported = app.activeDocument.exportFile(
    destFile,
    ExportType.PNG24,
    exportOptions
  );
  return destFile;
}
