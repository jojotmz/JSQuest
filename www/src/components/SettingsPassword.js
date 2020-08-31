import React, { useState } from "react";
import FormField from "components/FormField";
import SectionButton from "components/SectionButton";
import { useAuth } from "util/auth.js";
import { useForm } from "react-hook-form";

function SettingsPassword(props) {
  const auth = useAuth();
  const [pending, setPending] = useState(false);

  const { register, handleSubmit, errors, reset, getValues } = useForm();

  const onSubmit = (data) => {
    // Show pending indicator
    setPending(true);

    auth
      .updatePassword(data.pass)
      .then(() => {
        // Clear form
        reset();
        // Set success status
        props.onStatus({
          type: "success",
          message: "Your password has been updated",
        });
      })
      .catch((error) => {
        if (error.code === "auth/requires-recent-login") {
          // Update state to show re-authentication modal
          props.onStatus({
            type: "requires-recent-login",
            // Resubmit after reauth flow
            callback: () => onSubmit({ pass: data.pass }),
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
        name="pass"
        type="password"
        label="Password"
        placeholder="Password"
        error={errors.pass}
        inputRef={register({
          required: "Please enter a password",
        })}
      />
      <FormField
        name="confirmpass"
        type="password"
        label="Confirm New Password"
        placeholder="Confirm Password"
        error={errors.confirmPass}
        inputRef={register({
          required: "Please enter your new password again",
          validate: (value) => {
            if (value === getValues().pass) {
              return true;
            } else {
              return "This doesn't match your password";
            }
          },
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

export default SettingsPassword;
