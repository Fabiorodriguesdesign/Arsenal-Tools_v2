export default {
    title: 'Quote Generator',
    itemImportedSuccess: 'Item imported from Price Calculator!',
    steps: {
        provider: 'Your Info',
        client: 'Client',
        project: 'Project & Items',
        preview: 'Preview & PDF',
    },
    provider: {
        name: 'Your Name',
        company: 'Your Company (Optional)',
        document: 'Document (ID/Tax ID)',
        email: 'Your Email',
        phone: 'Your Phone',
        address: 'Your Address',
        logo: 'Company Logo',
    },
    client: {
        name: 'Client Name / Contact',
        company: 'Client Company',
        document: 'Client Document',
        email: 'Client Email',
        address: 'Client Address',
    },
    project: {
        title: 'Project Title',
        introduction: 'Introduction / Presentation',
        issueDate: 'Issue Date',
        validUntil: 'Valid Until',
        currency: 'Currency',
        terms: 'Terms and Conditions',
        termsPlaceholder: 'e.g., 50% upfront, 50% upon delivery...',
    },
    items: {
        addItem: 'Add Item',
        name: 'Item / Service',
        description: 'Description',
        quantity: 'Qty',
        unitPrice: 'Unit Price',
        total: 'Total:',
        empty: 'No items added.',
    }
};