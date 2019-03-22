rm -rf ../arnotes.github.io/static;
rm -rf ../arnotes.github.io/bootstrap.css;
rm -rf ../arnotes.github.io/favicon.ico;
rm -rf ../arnotes.github.io/index.html;
rm -rf ../arnotes.github.io/manifest.json;
rm -rf ../arnotes.github.io/precache-manifest.*.js;
rm -rf ../arnotes.github.io/service-worker.js;
rm -rf ../arnotes.github.io/asset-manifest.json;
npm run build;
cp -R build/* ../arnotes.github.io/