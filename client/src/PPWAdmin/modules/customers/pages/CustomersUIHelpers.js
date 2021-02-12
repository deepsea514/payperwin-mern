export const CustomerStatusCssClasses = ["danger", "success", "info", ""];
export const CustomerStatusTitles = ["Suspended", "Active", "Pending", ""];
export const CustomerTypeCssClasses = ["success", "primary", ""];
export const CustomerTypeTitles = ["Business", "Individual", ""];
export const defaultSorted = [{ dataField: "id", order: "asc" }];
export const sizePerPageList = [
    { text: "10", value: 10 },
    { text: "25", value: 25 },
    { text: "50", value: 50 },
    { text: "100", value: 100 },
];
export const initialFilter = {
    filter: {
        lastName: "",
        firstName: "",
        email: "",
        ipAddress: ""
    },
    pageNumber: 1,
    pageSize: 25
};
