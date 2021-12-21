# validate-c19-node-wrapper-executable
 A nodejs wrapper to check gp for Covid 19 using the official APIs

Check Green Pass Validity
This tool is an executable wrapper for the official Verifica C19 SDK.It is used to validate a certificate image.
See: https://github.com/italia/verificac19-sdk
Usage: checkdgc [options] /<image>
Options:
  --help                 Print this help message
  --version              Print the version of this tool
  --verbose              Print verbose output
  --base64 /<base64>      Validate a certificate image encoded in base64
  --short                Print only the validation code
  --super                Use the super DGP rules
  --no-signature         Skip signature validation
  --no-update            Skip update of the DGP rules

Examples:
  checkdgc --verbose --short --super --no-signature --no-update path/to/image.png
  checkdgc --short --super path/to/image.png # Print only the validation code

In the test folder there are some example images to validate. All the images are taken from https://github.com/eu-digital-green-certificates/dgc-testdata
If you want you can use your own dgc image to check signature validation.

## compile to executable

You can do it using pkg:

```sh 
npm i -g pkg
```

Then: 

```sh 
pkg app.js
```

Automatic compilation with npm scripts:

```sh 
npm install
npm install -g pkg
npm run build-windows
```

