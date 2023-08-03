import Chat from './chat.model';

export type Keyed<T> = Partial<T> & ({
    key: string
} | { 
    _id: string 
}) | {}

export interface Value<T> {
    value: T
}

export interface Record {
    save(): Promise<void>
}

export class Table<T> {
    name: string = '';

    record(record: Keyed<T>): Keyed<T> & Record {
        throw new Error('Method not implemented.');
    }
    
    replaceOne(indexer: Keyed<T>, record: T, options?: { upsert: boolean; }): Promise<void> {
        throw new Error('Method not implemented.');
    }
  
    updateOne(indexer: Keyed<T>, record: Partial<T>, options?: { upsert: boolean; }): Promise<void> {
        throw new Error('Method not implemented.');
    }

    deleteOne(indexer: Keyed<T>): Promise<void> {
        throw new Error('Method not implemented.');
    }

    findOneAndDelete(indexer: Keyed<T>): Promise<Value<T> | null> {
        throw new Error('Method not implemented.');
    }

    findOne(indexer: Keyed<T>): Promise<T | null> {
        throw new Error('Method not implemented.');
    }
  
    find(indexer: Keyed<T>): Promise<T[] | null> {
        throw new Error('Method not implemented.');
    }

    drop(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

export default class Database {
    Chat: Table<Chat> = <any> {};
    
    listTable(): Promise<Table<any>[]> {
        throw new Error('Method not implemented.');
    }

    table(name: string): Table<any> {
        throw new Error('Method not implemented.');
    }
}
