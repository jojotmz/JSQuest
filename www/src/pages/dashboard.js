import React from "react";
import DashboardSection from "components/DashboardSection";
import { requireAuth } from "util/auth.js";

function DashboardPage(props) {
  return (
    <DashboardSection
      color="white"
      size="medium"
      title="Dashboard"
      subtitle=""
    />
  );
}

export default requireAuth(DashboardPage);
