const CREATE_DRAFT_ORDER = `
    mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
        draftOrder {
            id
        }
        userErrors {
            field
            message
        }
        }
    }
`;

export { CREATE_DRAFT_ORDER };