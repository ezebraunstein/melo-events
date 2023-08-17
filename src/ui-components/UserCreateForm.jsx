/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { User } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function UserCreateForm(props) {
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
    nameUser: "",
    surnameUser: "",
    dniUser: "",
    emailUser: "",
  };
  const [nameUser, setNameUser] = React.useState(initialValues.nameUser);
  const [surnameUser, setSurnameUser] = React.useState(
    initialValues.surnameUser
  );
  const [dniUser, setDniUser] = React.useState(initialValues.dniUser);
  const [emailUser, setEmailUser] = React.useState(initialValues.emailUser);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setNameUser(initialValues.nameUser);
    setSurnameUser(initialValues.surnameUser);
    setDniUser(initialValues.dniUser);
    setEmailUser(initialValues.emailUser);
    setErrors({});
  };
  const validations = {
    nameUser: [{ type: "Required" }],
    surnameUser: [{ type: "Required" }],
    dniUser: [{ type: "Required" }],
    emailUser: [{ type: "Required" }, { type: "Email" }],
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
          nameUser,
          surnameUser,
          dniUser,
          emailUser,
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
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          await DataStore.save(new User(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "UserCreateForm")}
      {...rest}
    >
      <TextField
        label="Name user"
        isRequired={true}
        isReadOnly={false}
        value={nameUser}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              nameUser: value,
              surnameUser,
              dniUser,
              emailUser,
            };
            const result = onChange(modelFields);
            value = result?.nameUser ?? value;
          }
          if (errors.nameUser?.hasError) {
            runValidationTasks("nameUser", value);
          }
          setNameUser(value);
        }}
        onBlur={() => runValidationTasks("nameUser", nameUser)}
        errorMessage={errors.nameUser?.errorMessage}
        hasError={errors.nameUser?.hasError}
        {...getOverrideProps(overrides, "nameUser")}
      ></TextField>
      <TextField
        label="Surname user"
        isRequired={true}
        isReadOnly={false}
        value={surnameUser}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              nameUser,
              surnameUser: value,
              dniUser,
              emailUser,
            };
            const result = onChange(modelFields);
            value = result?.surnameUser ?? value;
          }
          if (errors.surnameUser?.hasError) {
            runValidationTasks("surnameUser", value);
          }
          setSurnameUser(value);
        }}
        onBlur={() => runValidationTasks("surnameUser", surnameUser)}
        errorMessage={errors.surnameUser?.errorMessage}
        hasError={errors.surnameUser?.hasError}
        {...getOverrideProps(overrides, "surnameUser")}
      ></TextField>
      <TextField
        label="Dni user"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={dniUser}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              nameUser,
              surnameUser,
              dniUser: value,
              emailUser,
            };
            const result = onChange(modelFields);
            value = result?.dniUser ?? value;
          }
          if (errors.dniUser?.hasError) {
            runValidationTasks("dniUser", value);
          }
          setDniUser(value);
        }}
        onBlur={() => runValidationTasks("dniUser", dniUser)}
        errorMessage={errors.dniUser?.errorMessage}
        hasError={errors.dniUser?.hasError}
        {...getOverrideProps(overrides, "dniUser")}
      ></TextField>
      <TextField
        label="Email user"
        isRequired={true}
        isReadOnly={false}
        value={emailUser}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              nameUser,
              surnameUser,
              dniUser,
              emailUser: value,
            };
            const result = onChange(modelFields);
            value = result?.emailUser ?? value;
          }
          if (errors.emailUser?.hasError) {
            runValidationTasks("emailUser", value);
          }
          setEmailUser(value);
        }}
        onBlur={() => runValidationTasks("emailUser", emailUser)}
        errorMessage={errors.emailUser?.errorMessage}
        hasError={errors.emailUser?.hasError}
        {...getOverrideProps(overrides, "emailUser")}
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
