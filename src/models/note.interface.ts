export interface INote{
    ID?: string;
    UID: string;
    Title: string;
    Body: string;
    Index?: number;
    FolderID?: string;
    IsReadOnly?: boolean;
}