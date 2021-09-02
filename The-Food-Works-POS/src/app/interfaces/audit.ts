
export interface Audit {
    ID: number;
    TIMESTAMP: Date;
    CONTROLLER: string;
    ACTION: string;
    PARAMETERS: string;
}
