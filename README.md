# validate-c19-node-wrapper-executable
 A nodejs wrapper to check gp for Covid 19 using the official APIs

Check Green Pass Validity
This tool is an executable wrapper for the official Verifica C19 SDK.\nIt is used to validate a certificate image.
See: https://github.com/italia/verificac19-sdk\n\n

Usage: checkgp [options] <image>
Options:
  --help                 Print this help message
  --version              Print the version of this tool
  --verbose              Print verbose output
  --base64 <base64>      Validate a certificate image encoded in base64
  --short                Print only the validation code\n`

## compile to executable

You can do it using pkg:

```bash npm i -g pkg```

Then: 

```bash pkg app.js```

