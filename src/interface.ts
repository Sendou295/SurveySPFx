import { ChoiceFieldFormatType } from "@pnp/sp/fields/types";


export interface ISurvey{
    Index: number;
    Answer1: string;
    Fullname: string;
    Email: string;
    DOB: Date;
    Age: number;
    Skills: ChoiceFieldFormatType;
    RatingSurvey: number;

}
