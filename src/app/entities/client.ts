import { MiaModel } from "@agencycoda/mia-core";

export class Client extends MiaModel {
    id: number = 0;
    firstname: string = '';
    lastname: string = '';
    email: string = '';
    address: string = '';
    photo: string = '';
    caption: string = '';
    created_at: string = '';
    updated_at: string = '';
    deleted: number = 0;

}