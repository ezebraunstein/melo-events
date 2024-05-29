/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createRRPP } from "../graphql/mutations";
const client = generateClient();
export default function RRPPCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    nameRRPP: "",
    surnameRRPP: "",
    dniRRPP: "",
    emailRRPP: "",
  };
  const [nameRRPP, setNameRRPP] = React.useState(initialValues.nameRRPP);
  const [surnameRRPP, setSurnameRRPP] = React.useState(
    initialValues.surnameRRPP
  );
  const [dniRRPP, setDniRRPP] = React.useState(initialValues.dniRRPP);
  const [emailRRPP, setEmailRRPP] = React.useState(initialValues.emailRRPP);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setNameRRPP(initialValues.nameRRPP);
    setSurnameRRPP(initialValues.surnameRRPP);
    setDniRRPP(initialValues.dniRRPP);
    setEmailRRPP(initialValues.emailRRPP);
    setErrors({});
  };
  const validations = {
    nameRRPP: [{ type: "Required" }],
    surnameRRPP: [{ type: "Required" }],
    dniRRPP: [{ type: "Required" }],
    emailRRPP: [{ type: "Required" }, { type: "Email" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          nameRRPP,
          surnameRRPP,
          dniRRPP,
          emailRRPP,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createRRPP.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "RRPPCreateForm")}
      {...rest}
    >
      <TextField
        label="Name rrpp"
        isRequired={true}
        isReadOnly={false}
        value={nameRRPP}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              nameRRPP: value,
              surnameRRPP,
              dniRRPP,
              emailRRPP,
            };
            const result = onChange(modelFields);
            value = result?.nameRRPP ?? value;
          }
          if (errors.nameRRPP?.hasError) {
            runValidationTasks("nameRRPP", value);
          }
          setNameRRPP(value);
        }}
        onBlur={() => runValidationTasks("nameRRPP", nameRRPP)}
        errorMessage={errors.nameRRPP?.errorMessage}
        hasError={errors.nameRRPP?.hasError}
        {...getOverrideProps(overrides, "nameRRPP")}
      ></TextField>
      <TextField
        label="Surname rrpp"
        isRequired={true}
        isReadOnly={false}
        value={surnameRRPP}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              nameRRPP,
              surnameRRPP: value,
              dniRRPP,
              emailRRPP,
            };
            const result = onChange(modelFields);
            value = result?.surnameRRPP ?? value;
          }
          if (errors.surnameRRPP?.hasError) {
            runValidationTasks("surnameRRPP", value);
          }
          setSurnameRRPP(value);
        }}
        onBlur={() => runValidationTasks("surnameRRPP", surnameRRPP)}
        errorMessage={errors.surnameRRPP?.errorMessage}
        hasError={errors.surnameRRPP?.hasError}
        {...getOverrideProps(overrides, "surnameRRPP")}
      ></TextField>
      <TextField
        label="Dni rrpp"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={dniRRPP}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              nameRRPP,
              surnameRRPP,
              dniRRPP: value,
              emailRRPP,
            };
            const result = onChange(modelFields);
            value = result?.dniRRPP ?? value;
          }
          if (errors.dniRRPP?.hasError) {
            runValidationTasks("dniRRPP", value);
          }
          setDniRRPP(value);
        }}
        onBlur={() => runValidationTasks("dniRRPP", dniRRPP)}
        errorMessage={errors.dniRRPP?.errorMessage}
        hasError={errors.dniRRPP?.hasError}
        {...getOverrideProps(overrides, "dniRRPP")}
      ></TextField>
      <TextField
        label="Email rrpp"
        isRequired={true}
        isReadOnly={false}
        value={emailRRPP}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              nameRRPP,
              surnameRRPP,
              dniRRPP,
              emailRRPP: value,
            };
            const result = onChange(modelFields);
            value = result?.emailRRPP ?? value;
          }
          if (errors.emailRRPP?.hasError) {
            runValidationTasks("emailRRPP", value);
          }
          setEmailRRPP(value);
        }}
        onBlur={() => runValidationTasks("emailRRPP", emailRRPP)}
        errorMessage={errors.emailRRPP?.errorMessage}
        hasError={errors.emailRRPP?.hasError}
        {...getOverrideProps(overrides, "emailRRPP")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
