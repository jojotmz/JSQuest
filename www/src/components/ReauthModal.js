import React, { useState } from "react";
import FormAlert from "components/FormAlert";
import FormField from "components/FormField";
import SectionButton from "components/SectionButton";
import AuthSocial from "components/AuthSocial";
import { useAuth } from "util/auth.js";
import { useForm } from "react-hook-form";

function ReauthModal(props) {
  const auth = useAuth();
  const [pending, setPending] = useState(false);
  const [formAlert, setFormAlert] = useState(null);

  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data) => {
    const { pass } = data;
    setPending(true);

    auth
      .signin(auth.user.email, pass)
      .then(() => {
        // Call failed action that originally required reauth
        props.callback();
        // Let parent know we're done so they can hide modal
        props.onDone();
      })
      .catch((error) => {
        // Hide pending indicator
        setPending(false);
        // Show error alert message
        setFormAlert({
          type: "error",
          message: error.message,
        });
      });
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" />
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            Please sign in again to complete this action
          </p>
          <span className="card-header-icon">
            <a
              className="delete"
              ariaLabel="close"
              onClick={(e) => props.onCancel()}
            />
          </span>
        </header>
        <section className="card-content">
          {formAlert && (
            <FormAlert type={formAlert.type} message={formAlert.message} />
          )}

          {props.provider === "password" && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormField
                name="pass"
                type="password"
                placeholder="Password"
                error={errors.pass}
                inputRef={register({
                  required: "Please enter your password",
                })}
              />
              <div className="field">
                <div className="control">
                  <SectionButton
                    parentColor={props.parentColor}
                    size="medium"
                    state={pending ? "loading" : "normal"}
                  >
                    Sign in
                  </SectionButton>
                </div>
              </div>
            </form>
          )}

          {props.provider !== "password" && (
            <AuthSocial
              type="signin"
              buttonText="Sign in"
              showLastUsed={false}
              providers={[props.provider]}
              onAuth={() => {
                props.callback();
                props.onDone();
              }}
              onError={(message) => {
                setFormAlert({
                  type: "error",
                  message: message,
                });
              }}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default ReauthModal;
