const { Validator, Service, Certificate } = require('verificac19-sdk');

const version = '1.0.0';
const verbose = process.argv.includes('--verbose');
const shortMode = process.argv.includes('--short');
const update = !process.argv.includes('--no-update');
const mode = process.argv.includes('--super') ? Validator.mode.SUPER_DGP : Validator.mode.NORMAL_DGP;
const signature = !process.argv.includes('--no-signature');

/**
 * @description Validates a certificate image (Green Pass) and prints the result to the console
 */
const validateGreenPass = async() => {
    if (process.argv.length > 2) {
        try {
            if (process.argv.includes('--help')) {
                console.log(printHelp());
                return;
            }
            if (process.argv.includes('--version')) {
                console.log(version);
                return;
            }
            if (update) {
                log('Updating greenpass rules...');
                await Service.updateAll();
            }
            let img = ""
            if (process.argv.includes('--base64')) {
                log('Reading base64 image data...');
                img = await Certificate.fromRaw(process.argv[process.argv.indexOf('--base64') + 1]);
            } else {
                log('Reading image file...');
                img = await Certificate.fromImage(process.argv[process.argv.length - 1]);
            }
            log('Validating image...');
            let validationResult = ""
            if (signature) {
                validationResult = await Validator.validate(img, mode);
            } else {
                validationResult = await Validator.checkRules(img, mode);
            }
            if (typeof validationResult === 'object') {
                if (shortMode) {
                    console.log(validationResult.code);
                } else {
                    console.log(JSON.stringify(validationResult, null, 2));
                }
            }
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    } else {
        console.error('Please provide a certificate image or raw data');
        process.exit(1);
    }
}

/**
 * 
 * @param {*} message - The message to log to the console
 * @description Logs a message to the console if verbose mode is enabled
 */
function log(message) {
    if (verbose) {
        console.log(message);
    }
}

/**
 * 
 * @returns {string} - The help text for the program in the console
 */
function printHelp() {
    return `\n\nCheck Green Pass Validity - v${version}\n\n` +
        `This tool is an executable wrapper for the official Verifica C19 SDK.\nIt is used to validate a certificate image.\n` +
        `See: https://github.com/italia/verificac19-sdk\n\n` +
        `Usage: checkdgc [options] <image>\n\n` +
        `Options:\n` +
        `  --help                 Print this help message\n` +
        `  --version              Print the version of this tool\n` +
        `  --verbose              Print verbose output\n` +
        `  --base64 <base64>      Validate a certificate image encoded in base64\n` +
        `  --short                Print only the validation code\n` +
        `  --super                Use the super DGP rules\n` +
        `  --no-signature         Skip signature validation\n` +
        `  --no-update            Skip update of the DGP rules\n` +
        `\n\n` +
        `Examples:\n` +
        `  checkdgc --verbose --short --super --no-signature --no-update image.png\n` +
        `  checkdgc --short --super path/to/image.png\n` +
        `\n\n`;
}


(async() => {
    await validateGreenPass();
    process.exit(0);
})()