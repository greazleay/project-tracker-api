export enum IssuePriority {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}

export enum IssueStatus {
    OPEN = 'OPEN',
    INVESTIGATING = 'INVESTIGATING',
    IMPLEMENTING = 'IMPLEMENTING',
    ESCALATED = 'ESCALATED',
    RESOLVED = 'RESOLVED'
}

export enum IssueType {
    TECHNICAL = 'TECHNICAL',                    // Relating to technological issues
    BUSINESS_PROCESS = 'BUSINESS PROCESS',      // Relating to project design
    CHANGE_MANAGEMENT = 'CHANGE MANAGEMENT',    // Relating to business, customer or environmental changes
    RESOURCE = 'RESOURCE',                      // Relating to equipment, material, or people problems
    THIRD_PARTY = 'THIRD PARTY',                // Relating to issues with vendors, suppliers, or another outside party
}