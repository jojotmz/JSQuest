import React, { useState } from "react";
import FormField from "components/FormField";
import SectionButton from "components/SectionButton";
import { useAuth } from "util/auth.js";
import { useForm } from "react-hook-form";

function SettingsGeneral(props) {
  const auth = useAuth();
  const [pending, setPending] = useState(false);

  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data) => {
    // Show pending indicator
    setPending(true);

    return auth
      .updateProfile(data)
      .then(() => {
        // Set success status
        props.onStatus({
          type: "success",
          message: "Your profile has been updated",
        });
      })
      .catch((error) => {
        if (error.code === "auth/requires-recent-login") {
          props.onStatus({
            type: "requires-recent-login",
            // Resubmit after reauth flow
            callback: () => onSubmit(data),
          });
        } else {
          // Set error status
          props.onStatus({
            type: "error",
            message: error.message,
          });
        }
      })
      .finally(() => {
        // Hide pending indicator
        setPending(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        name="name"
        type="text"
        label="Name"
        defaultValue={auth.user.name}
        placeholder="Name"
        error={errors.name}
        inputRef={register({
          required: "Please enter your name",
        })}
      />
      <FormField
        name="email"
        type="email"
        label="Email"
        defaultValue={auth.user.email}
        placeholder="Email"
        error={errors.email}
        inputRef={register({
          required: "Please enter your email",
        })}
      />
      <div className="field">
        <div className="control">
          <SectionButton
            parentColor={props.parentColor}
            size="medium"
            state={pending ? "loading" : "normal"}
          >
            Save
          </SectionButton>
        </div>
      </div>
    </form>
  );
}

export default SettingsGeneral;
