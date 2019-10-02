import * as React from "react";

import NewVersionToast from "../../connected/NewVersionToast/NewVersionToast";
import OnlineStatusToast from "../../connected/OnlineStatusToast/OnlineStatusToast";

import "./ToastContainer.scss";

const ToastContainer: React.FC = () => (
  <section className="ToastContainer">
    <OnlineStatusToast />
    <NewVersionToast />
  </section>
);

export default ToastContainer;
