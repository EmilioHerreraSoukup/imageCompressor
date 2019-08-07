const imagemin = require("imagemin");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminSVG = require("imagemin-svgo");
const fs = require("fs-extra");
const path = require("path");

let inDir, outDir;

inDir = "./images";
outDir = "./compressed";

fs.removeSync(outDir);

console.log("Processing images...\n");

fs.mkdirSync(outDir);

imagemin([`${inDir}/*.{jpg,png,gif,svg,webp}`], {
  destination: outDir,
  plugins: [
    imageminMozjpeg({ quality: 80 }),
    imageminPngquant({ quality: [0.65,0.8] }),
    imageminGifsicle({ optimizationLevel: 3 }),
    imageminSVG({
      plugins: [
        {
          cleanupAttrs: true,
          inlineStyles: true,
          removeDoctype: true,
          removeXMLProcInst: true,
          removeComments: true,
          removeMetadata: true,
          removeTitle: true,
          removeDesc: true,
          removeUselessDefs: true,
          removeXMLNS: false,
          removeEditorsNSData: true,
          removeEmptyAttrs: true,
          removeHiddenElems: true,
          removeEmptyText: true,
          removeEmptyContainers: true,
          removeViewBox: false,
          cleanupEnableBackground: true,
          minifyStyles: true,
          convertStyleToAttrs: true,
          convertColors: true,
          convertPathData: true,
          convertTransform: true,
          removeUnknownsAndDefaults: true,
          removeNonInheritableGroupAttrs: true,
          removeUselessStrokeAndFill: true,
          removeUnusedNS: true,
          cleanupIDs: true,
          cleanupNumericValues: true,
          cleanupListOfValues: true,
          moveElemsAttrsToGroup: true,
          moveGroupAttrsToElems: true,
          collapseGroups: true,
          removeRasterImages: true,
          mergePaths: true,
          convertShapeToPath: true,
          sortAttrs: true,
          removeDimensions: true,
          removeAttrs: true,
          removeElementsByAttr: true,
          addClassesToSVGElement: true,
          addAttributesToSVGElement: true,
          removeStyleElement: false,
          removeScriptElement: true
        }
      ]
    })
  ]
}).then(files => {

  
  console.log("Image Optimization Results");
  console.log("==============================");
  logStats(files);
});

function logStats(files) {
  let totalSaved = 0;
  files.forEach(function(obj) {


    let stats = getStats(obj);
    console.log(
      Math.round(((stats.oldSize - stats.newSize) / stats.oldSize) * 100) + "%",
      stats.file
    );
    totalSaved += stats.oldSize - stats.newSize;
  });
  console.log("===============================\n", btokb(totalSaved) + " Saved");
  console.log("", "Files written to " + outDir);
}

function getStats(file) {

  console.log('emilio',file);
  let fileName = path.parse(file.sourcePath).base;
  let fileStats = fs.statSync(file.destinationPath);
  let oldFileStats = fs.statSync(path.join(inDir, fileName));


  return {
    file: fileName,
    oldSize: oldFileStats["size"],
    newSize: fileStats["size"]
  };
}

function btokb(val) {
  return (val / 1000).toFixed(1) + "kb";
}
