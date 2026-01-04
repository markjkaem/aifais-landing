const { spawn } = require('child_process');
const path = require('path');

// ============================================
// MASTER TEST RUNNER
// Run all API tests sequentially
// ============================================

const tests = [
    {
        name: 'Invoice Scanner',
        script: 'test-invoice-scanner.js',
        description: 'Tests bulk invoice scanning with AI'
    },
    {
        name: 'Contract Checker',
        script: 'test-contract-checker.js',
        description: 'Tests contract analysis and PDF report generation'
    },
    {
        name: 'Quote Generator',
        script: 'test-quote-generator.js',
        description: 'Tests quote PDF generation'
    },
    {
        name: 'Terms Generator',
        script: 'test-terms-generator.js',
        description: 'Tests AI-powered terms & conditions generation'
    }
];

async function runTest(test) {
    return new Promise((resolve, reject) => {
        console.log('\n' + '━'.repeat(70));
        console.log(`🚀 Running: ${test.name}`);
        console.log(`📝 ${test.description}`);
        console.log('━'.repeat(70));

        const child = spawn('node', [path.join(__dirname, 'tests', test.script)], {
            stdio: 'inherit',
            shell: true
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`\n✅ ${test.name} completed successfully\n`);
                resolve();
            } else {
                console.log(`\n❌ ${test.name} failed with code ${code}\n`);
                reject(new Error(`Test failed: ${test.name}`));
            }
        });

        child.on('error', (error) => {
            console.error(`\n❌ Error running ${test.name}:`, error.message);
            reject(error);
        });
    });
}

async function runAllTests() {
    console.log('\n' + '═'.repeat(70));
    console.log('🧪 AIFAIS API TEST SUITE');
    console.log('═'.repeat(70));
    console.log(`📊 Total tests: ${tests.length}`);
    console.log(`🕐 Started at: ${new Date().toLocaleTimeString()}`);
    console.log('═'.repeat(70));

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            await runTest(test);
            passed++;
        } catch (error) {
            failed++;
            console.error(`❌ ${test.name} failed:`, error.message);
        }
    }

    console.log('\n' + '═'.repeat(70));
    console.log('📊 TEST SUMMARY');
    console.log('═'.repeat(70));
    console.log(`✅ Passed: ${passed}/${tests.length}`);
    console.log(`❌ Failed: ${failed}/${tests.length}`);
    console.log(`🕐 Finished at: ${new Date().toLocaleTimeString()}`);
    console.log('═'.repeat(70));

    if (failed > 0) {
        console.log('\n⚠️  Some tests failed. Check the output above for details.');
        process.exit(1);
    } else {
        console.log('\n🎉 All tests passed!');
        process.exit(0);
    }
}

// Run tests
runAllTests().catch(error => {
    console.error('\n❌ Test suite error:', error);
    process.exit(1);
});
