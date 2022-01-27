// test the app:
var expect = require('chai').expect;
var should = require('chai').should();
const { describe, it } = require('mocha');
const util = require("util");
var exec = util.promisify(require("child_process").exec);

var run = function(args) {
    try {
        const _args = ["checkdgc.js"];
        return exec(`node ${_args.concat(args).join(" ")}`);
    } catch (error) {
        throw error;
    }
};

describe('Test app', function() {
    it(`should work with params ['--version']`, async() => {
        const result = await run(['--version']);
        result.stdout.should.equal("1.1.0\n");
    });
    it(`should work with params ['--short', '--no-signature', 'test/SK_1.png'] and be NOT_VALID`, async() => {
        const result = await run(['--short', '--no-signature', 'test/SK_1.png'])
        result.stdout.should.equal('NOT_VALID\n');
    });
    it(`should work with params ['--short', '--no-signature', 'test/SM_1.png'] and be VALID`, async() => {
        const result = await run(['--short', '--no-signature', 'test/SM_1.png'])
        result.stdout.should.equal('VALID\n');
    });
    it(`should work with params ['--short', '--no-signature', 'test/signed_cert.png'] and be NOT_VALID`, async() => {
        const result = await run(['--short', '--no-signature', 'test/signed_cert.png'])
        result.stdout.should.equal('NOT_VALID\n');
    });
    it(`should work with params ['--short', '--no-signature', 'test/uk_qr_vaccine_dose1.png'] and be NOT_VALID`, async() => {
        const result = await run(['--short', '--no-signature', 'test/uk_qr_vaccine_dose1.png'])
        result.stdout.should.equal('NOT_VALID\n');
    });
    it(`should work with params ['--short', '--no-signature', 'test/example_qr_vaccine_recovery.png'] and be VALID`, async() => {
        const result = await run(['--short', '--no-signature', 'test/example_qr_vaccine_recovery.png'])
        result.stdout.should.equal('VALID\n');
    });
    it(`should work with params ['--short', '--no-signature', 'test/valid_italian.png'] and be NOT_VALID`, async() => {
        const result = await run(['--short', '--no-signature', 'test/valid_italian.png'])
        result.stdout.should.equal('NOT_VALID\n');
    });
    it(`should work with params ['--short', '--no-signature', 'test/italian_molecular.png'] and be NOT_VALID`, async() => {
        const result = await run(['--short', '--no-signature', 'test/italian_molecular.png'])
        result.stdout.should.equal('NOT_VALID\n');
    });
    it(`should work with params ['--short', '--no-signature', 'test/invalid.png']`, async() => {
        try {
            await run(['--short', '--no-signature', 'test/invalid.png'])
        } catch (error) {
            error.message.should.include('Invalid');
        }
    });
});