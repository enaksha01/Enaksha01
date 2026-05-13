import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1') 
    .setProject('6a0417e1002b225c119c'); 

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Aapki Final IDs yahan set hain
export const APPWRITE_CONFIG = {
    dbId: '6a0417e1002b225c119c', // Jo aapke dashboard pe naam/id dikh rahi hai
    collectionId: '6a0421b1001d11330884', 
    bucketId: '6a0426ed002f7e8a2cf2' 
};
