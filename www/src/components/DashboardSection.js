import React from "react";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import Link from "next/link";
import { useAuth } from "util/auth.js";
import { useRouter } from "next/router";
import "components/DashboardSection.scss";

function DashboardSection(props) {
  const auth = useAuth();
  const router = useRouter();

  return (
    <Section color={props.color} size={props.size}>
      <div className="container">
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={3}
          spaced={true}
          className="has-text-centered"
        />

        {router.query.paid && auth.user.planIsActive && (
          <article className="DashboardSection__paid-message message is-success mx-auto">
            <div className="message-body">
              You are now subscribed&nbsp;&nbsp;🥳
            </div>
          </article>
        )}

        <div className="columns is-vcentered is-desktop mt-5">
          <div className="column is-6-desktop">
            <div className="content">
              <p>
                This would be a good place to build your custom product features
                after exporting your codebase.
              </p>
              <p>
                You can grab the current user, query your database, render
                custom components, and anything else you'd like.
              </p>
              <p>
                Divjoy sets you up with everything you need so that you can get
                right to work on building your web app.
              </p>
            </div>
          </div>
          <div className="column is-1" />
          <div className="column">
            <figure className="DashboardSection__image image">
              <img
                src="https://uploads.divjoy.com/undraw-personal_settings_kihd.svg"
                alt="Illustration"
              />
            </figure>
          </div>
        </div>
        <div
          className="mx-auto has-text-centered mt-5"
          style={{
            maxWidth: "460px",
          }}
        >
          <small>Some helpful debug info 🐛</small>
          <nav className="panel mt-3">
            <div className="panel-block is-block">
              Logged in as&nbsp;<strong>{auth.user.email}</strong>
            </div>
            <div className="panel-block is-block">
              {auth.user.stripeSubscriptionId && (
                <>
                  Subscription data
                  <br />
                  ID: <strong>{auth.user.stripeSubscriptionId}</strong>
                  <br />
                  Price ID: <strong>{auth.user.stripePriceId}</strong>
                  <br />
                  Status: <strong>{auth.user.stripeSubscriptionStatus}</strong>
                </>
              )}

              {!auth.user.stripeSubscriptionId && (
                <Link href="/pricing">
                  <a>Subscribe to a plan</a>
                </Link>
              )}
            </div>
            <div className="panel-block is-block">
              <Link href="/settings/general">
                <a>Account settings</a>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </Section>
  );
}

export default DashboardSection;
