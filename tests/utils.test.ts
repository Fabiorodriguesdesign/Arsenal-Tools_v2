import { getStatusClass, getOptionClass, escapeCSVField } from '../utils';
import { LEAD_STATUS_OPTIONS, LeadStatus } from '../types';

// Simple Test Runner (for demonstration without a framework like Jest/Vitest)
const tests: { description: string, test: () => void }[] = [];
let failures = 0;
let passes = 0;

function it(description: string, test: () => void) {
    tests.push({ description, test });
}

function assertEqual(actual: any, expected: any, message: string) {
    if (actual !== expected) {
        console.error(`❌ FAILED: ${message}`);
        console.error(`  -> Expected: "${expected}"`);
        console.error(`  -> Actual:   "${actual}"`);
        failures++;
    } else {
        passes++;
    }
}

// --- Test Suites ---

it('getStatusClass should return correct classes for each lead status', () => {
    const expectations: Record<LeadStatus, string> = {
        'Novo': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'Em contato': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        'Assinante': 'bg-green-500/10 text-green-400 border-green-500/20',
    };

    LEAD_STATUS_OPTIONS.forEach(status => {
        assertEqual(
            getStatusClass(status),
            expectations[status],
            `getStatusClass for status "${status}"`
        );
    });
});

it('getOptionClass should return correct classes for each lead status option', () => {
    const expectations: Record<LeadStatus, string> = {
        'Novo': 'text-blue-400',
        'Em contato': 'text-yellow-400',
        'Assinante': 'text-green-400',
    };
    
    LEAD_STATUS_OPTIONS.forEach(status => {
        assertEqual(
            getOptionClass(status),
            expectations[status],
            `getOptionClass for status "${status}"`
        );
    });
});

it('escapeCSVField should correctly escape fields for CSV format', () => {
    assertEqual(escapeCSVField('simple'), 'simple', 'handles simple string');
    assertEqual(escapeCSVField(123), '123', 'handles number');
    assertEqual(escapeCSVField(null), '', 'handles null');
    assertEqual(escapeCSVField(undefined), '', 'handles undefined');
    assertEqual(escapeCSVField('field,with,comma'), '"field,with,comma"', 'handles string with commas');
    assertEqual(escapeCSVField('field with "quote"'), '"field with ""quote"""', 'handles string with quotes');
    assertEqual(escapeCSVField('field with "quote" and , comma'), '"field with ""quote"" and , comma"', 'handles string with quotes and commas');
    assertEqual(escapeCSVField('field\nwith\nnewline'), '"field\nwith\nnewline"', 'handles string with newlines');
});


// --- Run Tests ---
function runTests() {
    console.log('🚀 Running unit tests...');
    const startTime = performance.now();
    
    tests.forEach(({ description, test }) => {
        // Reset counters for each test suite if needed, but for now we aggregate
        try {
            test();
        } catch (e) {
            console.error(`❌ ERROR in test: "${description}"`);
            console.error(e);
            failures++;
        }
    });
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    const totalAssertions = passes + failures;

    console.log('---');
    if (failures === 0) {
        console.log(`✅ All ${tests.length} test suites passed (${totalAssertions} assertions). (${duration}ms)`);
    } else {
        console.error(`❌ ${failures} out of ${totalAssertions} assertions failed in ${tests.length} test suites. (${duration}ms)`);
    }
    console.log('---');
}

// NOTE: This file is for demonstration purposes. 
// To run these tests, you would typically use a test runner like Jest or Vitest.
// You could import and execute runTests() in a development entry point (e.g., index.tsx) to see the output in the console.
// Example: import { runTests } from './tests/utils.test'; runTests();