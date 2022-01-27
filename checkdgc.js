const { Validator, Service, Certificate } = require('verificac19-sdk');
const crlManager = require('./crlmanager');

const version = '1.1.0';
const verbose = process.argv.includes('--verbose');
const shortMode = process.argv.includes('--short');
const printAll = process.argv.includes('--all');
const waitkey = process.argv.includes('--waitkey');
const noUpdate = process.argv.includes('--no-update');
const mode = process.argv.includes('--super') ? Validator.mode.SUPER_DGP : process.argv.includes('--booster') ? Validator.mode.BOOSTER_DGP : Validator.mode.NORMAL_DGP;
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
            if (!noUpdate) {
                log('Updating greenpass rules...');
                await Service.updateAll(crlManager);
            }
            let img = ""
            if (process.argv.includes('--raw')) {
                log('Reading raw qr data...');
                img = await Certificate.fromRaw(process.argv[process.argv.length - 1]);
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
                    printAll ? console.log(JSON.stringify(img, null, 2)) : console.log(JSON.stringify(validationResult, null, 2));
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
        `  --raw                  Validate a certificate giving the qr extracted string\n` +
        `  --short                Print only the validation code\n` +
        `  --print-all            Print all the certificate in JSON format\n` +
        `  --super                Use the super DGP rules\n` +
        `  --booster              Use the booster DGP rules\n` +
        `  --no-signature         Skip signature validation\n` +
        `  --no-update            Skip update of the DGP rules\n` +
        `  --waitkey              Wait for a keypress before exiting\n` +
        `\n\n` +
        `Examples:\n` +
        `  checkdgc --verbose --short --super --no-signature --no-update image.png\n` +
        `  checkdgc --short --super path/to/image.png\n` +
        `\n\n`;
}


(async() => {
    await validateGreenPass();
    // wait for user input to exit
    if (waitkey) {
        console.log('\n\nPress any key to exit...');
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', function(text) {
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
})()