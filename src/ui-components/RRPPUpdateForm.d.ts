/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type RRPPUpdateFormInputValues = {
    nameRRPP?: string;
    surnameRRPP?: string;
    dniRRPP?: number;
    emailRRPP?: string;
};
export declare type RRPPUpdateFormValidationValues = {
    nameRRPP?: ValidationFunction<string>;
    surnameRRPP?: ValidationFunction<string>;
    dniRRPP?: ValidationFunction<number>;
    emailRRPP?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RRPPUpdateFormOverridesProps = {
    RRPPUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    nameRRPP?: PrimitiveOverrideProps<TextFieldProps>;
    surnameRRPP?: PrimitiveOverrideProps<TextFieldProps>;
    dniRRPP?: PrimitiveOverrideProps<TextFieldProps>;
    emailRRPP?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type RRPPUpdateFormProps = React.PropsWithChildren<{
    overrides?: RRPPUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    rRPP?: any;
    onSubmit?: (fields: RRPPUpdateFormInputValues) => RRPPUpdateFormInputValues;
    onSuccess?: (fields: RRPPUpdateFormInputValues) => void;
    onError?: (fields: RRPPUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RRPPUpdateFormInputValues) => RRPPUpdateFormInputValues;
    onValidate?: RRPPUpdateFormValidationValues;
} & React.CSSProperties>;
export default function RRPPUpdateForm(props: RRPPUpdateFormProps): React.ReactElement;
