import type { IAnyObject } from "./helpers";

export enum FormFieldType {
    TEXT = "text",
    PASSWORD = "password",
    SELECT = "select",
    NUMBER = "number",
}

export interface IAppForm {
    onSubmitField: (fields: IAnyObject) => void
}

export type FormField<T = IAnyObject> =
    | ISelect<T>
    | IInput<T>
    | IPassword<T>
    | INumber<T>;

export interface FormFieldDefault<T> {
    key: keyof T & string;
    label: string;
    class?: string;
    params?: T;
    error?: string | null;
    validationRules?: ValidationRuleType[]; 
}

export interface ISelect<T> extends FormFieldDefault<T> {
    type: FormFieldType.SELECT;
    options: IOptions[];
    multiple?: boolean; 
    placeholder?: string; 
}

export interface IInput<T> extends FormFieldDefault<T> {
    type: FormFieldType.TEXT;
    maxlength?: number;
    minlength?: number; 
    placeholder?: string;
}

export interface IPassword<T> extends FormFieldDefault<T> {
    type: FormFieldType.PASSWORD;
    showToggle?: boolean;
    strengthMeter?: boolean;
}

export interface INumber<T> extends FormFieldDefault<T> {
    type: FormFieldType.NUMBER;
    inputmode?: "decimal" | "currency";
    prefixInput?: string | number;
    suffixInput?: string | number;
    needGroup?: boolean;
    min?: number;
    max?: number;
    step?: number;
}

export enum ValidationRuleType {
    REQUIRED = "required",
    EMAIL = "email",
    PASSWORD = "password",
}

export interface IOptions {
    label: string | number;
    value: any;
}
