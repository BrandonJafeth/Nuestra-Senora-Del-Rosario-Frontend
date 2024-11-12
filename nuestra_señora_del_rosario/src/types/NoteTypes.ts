export interface NoteRequest {
    id_Note?: number;
    reason: string;
    noteDate: string;  
    description: string;
    createdAt?: string;  
}