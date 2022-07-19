export enum AccessType {
    MANAGER = 'MANAGER',
    COLLABORATOR = 'COLLABORATOR',
    VIEWER = 'VIEWER',
    MANAGEMENT = 'ADMINISTRATION_OFFICE'
}

export enum ProjectStatus {
    PROPOSED = 'PROPOSED',       // Project in proposal phase
    PENDING = 'PENDING',        // Project approved but work yet to commence
    ACTIVE = 'ACTIVE',         // Project approved and work on-going
    OVERDUE = 'OVERDUE',        // Project in progress, but deadline for completion is overdue
    SUSPENDED = 'SUSPENDED',         // Project approved but work temporarily suspended
    COMPLETED = 'COMPLETED',      // Project completed
    CANCELED = 'CANCELED',       // Project canceled
    ARCHIVED = 'ARCHIVED'       // Hides Projects from main project list
}

export enum ProjectPriority {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}